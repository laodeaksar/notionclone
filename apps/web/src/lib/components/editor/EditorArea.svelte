<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { createEditor, type ImageFileResult } from "$lib/editor.js";
  import type { Editor } from "@tiptap/core";
  import type { Page } from "$lib/stores/page.js";
  import { GripVertical } from "lucide-svelte";

  let {
    page,
    onUpdate,
    editor = $bindable(null),
    imageSelected = $bindable(false),
    imageRect = $bindable(null),
    onOpenContextMenu,
    onCommentClick,
    onImageFile,
  }: {
    page: Page;
    onUpdate: (json: string) => void;
    editor?: Editor | null;
    imageSelected?: boolean;
    imageRect?: { left: number; top: number; width: number; height: number } | null;
    onOpenContextMenu?: (data: { x: number; y: number; blockPos: number | null }) => void;
    onCommentClick?: (commentId: string) => void;
    onImageFile?: (file: File) => Promise<ImageFileResult>;
  } = $props();

  let editorEl = $state<HTMLDivElement | null>(null);
  let editorWrapperEl = $state<HTMLDivElement | null>(null);

  let dragVisible = $state(false);
  let dragStyle = $state("");
  let hoveredBlockEl = $state<Element | null>(null);

  function checkImageSelection() {
    if (!editor) return;
    const { selection } = editor.state;
    const ns = selection as unknown as { node?: { type: { name: string } } };
    if (ns.node?.type.name === "image") {
      try {
        const domNode = editor.view.nodeDOM(selection.from) as Element | null;
        if (domNode) {
          // NodeView wraps in <figure>; get the actual <img> for accurate rect
          const imgEl =
            domNode instanceof HTMLImageElement
              ? domNode
              : (domNode.querySelector("img") ?? domNode);
          const rect = imgEl.getBoundingClientRect();
          imageRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          };
        } else {
          const coords = editor.view.coordsAtPos(selection.from);
          imageRect = { left: coords.left, top: coords.bottom, width: 0, height: 0 };
        }
        imageSelected = true;
      } catch {
        imageSelected = false;
        imageRect = null;
      }
    } else {
      imageSelected = false;
      imageRect = null;
    }
  }

  function handleMouseOver(e: MouseEvent) {
    if (!editorEl) return;
    const pmEl = editorEl.querySelector(".ProseMirror");
    if (!pmEl) return;
    const target = e.target as Element;
    for (const child of pmEl.children) {
      if (child === target || child.contains(target)) {
        hoveredBlockEl = child;
        const r = child.getBoundingClientRect();
        dragStyle = `position:fixed;left:${r.left - 30}px;top:${r.top + r.height / 2 - 12}px;z-index:30;`;
        dragVisible = true;
        return;
      }
    }
  }

  function handleMouseLeave(e: MouseEvent) {
    const rel = e.relatedTarget as Element | null;
    if (!rel || !editorWrapperEl?.contains(rel)) dragVisible = false;
  }

  function handleDragClick(e: MouseEvent) {
    e.stopPropagation();
    let blockPos: number | null = null;
    if (hoveredBlockEl && editor) {
      const r = hoveredBlockEl.getBoundingClientRect();
      const hit = editor.view.posAtCoords({ left: r.left + 4, top: r.top + r.height / 2 });
      blockPos = hit?.pos ?? null;
    }
    dragVisible = false;
    onOpenContextMenu?.({ x: e.clientX, y: e.clientY, blockPos });
  }

  onMount(() => {
    if (!editorEl) return;
    const inst = createEditor({
      element: editorEl,
      content: page.content,
      onUpdate: (json) => onUpdate(json),
      onImageFile,
    });
    editor = inst;
    inst.on("selectionUpdate", checkImageSelection);
    inst.on("transaction", checkImageSelection);
  });

  onDestroy(() => {
    editor?.destroy();
  });
</script>

<div
  bind:this={editorWrapperEl}
  role="region"
  aria-label="Document editor"
  onmouseover={handleMouseOver}
  onfocus={() => {}}
  onmouseleave={handleMouseLeave}
>
  {#if dragVisible}
    <button
      type="button"
      style={dragStyle}
      onclick={handleDragClick}
      onmouseenter={() => (dragVisible = true)}
      title="Click for block options"
      class="flex items-center justify-center w-6 h-6 rounded text-muted-foreground
             hover:bg-accent hover:text-foreground transition-colors cursor-pointer
             opacity-60 hover:opacity-100"
      aria-label="Block options"
    >
      <GripVertical class="w-4 h-4" strokeWidth={1.5} />
    </button>
  {/if}

  <div
    bind:this={editorEl}
    role="none"
    onclick={(e) => {
      const target = e.target as HTMLElement;
      const markEl = target.closest("[data-comment-id]") as HTMLElement | null;
      if (markEl) {
        const commentId = markEl.getAttribute("data-comment-id");
        if (commentId) {
          onCommentClick?.(commentId);
          // Blur the editor so the comment panel can receive focus.
          // The panel's $effect will call el.focus() on the thread element.
          editor?.commands.blur();
        }
      }
    }}
    onkeydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        const target = e.target as HTMLElement;
        const markEl = target.closest("[data-comment-id]") as HTMLElement | null;
        if (markEl) {
          const commentId = markEl.getAttribute("data-comment-id");
          if (commentId) onCommentClick?.(commentId);
        }
      }
    }}
    class="prose prose-neutral dark:prose-invert max-w-none min-h-96"
  ></div>
</div>

<style>
  :global(.ProseMirror) {
    outline: none;
    min-height: 24rem;
    padding: 0.25rem 0;
  }
  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: hsl(var(--muted-foreground));
    pointer-events: none;
    height: 0;
  }
  /* ── Image / figure NodeView ─────────────────────────────── */
  :global(.ProseMirror img),
  :global(.ProseMirror figure.image-figure img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.375rem;
    cursor: pointer;
    display: block;
  }

  /* Selection ring on the NodeView figure */
  :global(.ProseMirror figure.image-figure.ProseMirror-selectednode img) {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  /* Fallback for bare img nodes (legacy / clipboard) */
  :global(.ProseMirror img.ProseMirror-selectednode) {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  /* Figure wrapper */
  :global(.ProseMirror figure.image-figure) {
    margin: 0.5rem 0;
  }

  /* Caption */
  :global(.ProseMirror figure.image-figure figcaption) {
    display: block;
    text-align: center;
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
    padding: 0.3rem 0.5rem 0.1rem;
    outline: none;
    min-height: 1.4rem;
    cursor: text;
    border-radius: 0 0 0.25rem 0.25rem;
    transition: background-color 0.1s;
  }
  :global(.ProseMirror figure.image-figure figcaption:focus) {
    background-color: hsl(var(--muted) / 0.5);
  }
  /* Placeholder — only visible when empty AND focused */
  :global(.ProseMirror figure.image-figure figcaption:empty::before) {
    content: attr(data-placeholder);
    color: hsl(var(--muted-foreground) / 0.45);
    pointer-events: none;
  }
  :global(.ProseMirror figure.image-figure figcaption:empty:not(:focus)::before) {
    opacity: 0;
  }

  /* Pending upload: dimmed with dashed border */
  :global(.ProseMirror img[data-pending-id]),
  :global(.ProseMirror figure.image-figure img[data-pending-id]) {
    opacity: 0.55;
    outline: 2px dashed hsl(var(--muted-foreground));
    outline-offset: 3px;
  }
  /* Error state: red dashed border */
  :global(.ProseMirror img[data-pending-id^="error:"]),
  :global(.ProseMirror figure.image-figure img[data-pending-id^="error:"]) {
    opacity: 0.4;
    outline: 2px dashed hsl(var(--destructive));
    outline-offset: 3px;
  }

  :global(.ProseMirror hr) {
    border: none;
    border-top: 2px solid hsl(var(--border));
    margin: 1.5rem 0;
  }
  :global(.ProseMirror pre) {
    background: hsl(var(--muted));
    border-radius: 0.375rem;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.875rem;
  }
  :global(.ProseMirror code:not(pre code)) {
    background: hsl(var(--muted));
    border-radius: 0.2rem;
    padding: 0.1em 0.35em;
    font-size: 0.875em;
  }
  /* ── Blockquote / figure NodeView ───────────────────────── */
  :global(.ProseMirror blockquote),
  :global(.ProseMirror figure.blockquote-figure blockquote) {
    border-left: 3px solid hsl(var(--border));
    padding-left: 1rem;
    margin: 0;
    color: hsl(var(--muted-foreground));
    font-style: italic;
  }

  :global(.ProseMirror figure.blockquote-figure) {
    margin: 0.75rem 0;
  }

  /* Author / attribution tag */
  :global(.ProseMirror figure.blockquote-figure cite) {
    display: block;
    margin-top: 0.35rem;
    padding-left: calc(1rem + 3px); /* align with blockquote text */
    font-size: 0.8125rem;
    font-style: normal;
    font-weight: 500;
    color: hsl(var(--foreground) / 0.6);
    outline: none;
    min-height: 1.4rem;
    cursor: text;
    border-radius: 0.25rem;
    transition: background-color 0.1s;
  }
  :global(.ProseMirror figure.blockquote-figure cite::before) {
    content: "— ";
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
  }
  :global(.ProseMirror figure.blockquote-figure cite:focus) {
    background-color: hsl(var(--muted) / 0.45);
  }
  /* Placeholder — hidden by default, visible only on figure hover or cite focus */
  :global(.ProseMirror figure.blockquote-figure cite:empty::after) {
    content: attr(data-placeholder);
    color: transparent;
    font-weight: 400;
    font-style: italic;
    pointer-events: none;
    transition: color 0.15s;
  }
  :global(.ProseMirror figure.blockquote-figure cite:empty::before) {
    opacity: 0;
    transition: opacity 0.15s;
  }
  /* Reveal on figure hover */
  :global(.ProseMirror figure.blockquote-figure:hover cite:empty::after) {
    color: hsl(var(--muted-foreground) / 0.4);
  }
  :global(.ProseMirror figure.blockquote-figure:hover cite:empty::before) {
    opacity: 0.25;
  }
  /* Brighter when cite is focused */
  :global(.ProseMirror figure.blockquote-figure cite:empty:focus::after) {
    color: hsl(var(--muted-foreground) / 0.65);
  }
  :global(.ProseMirror figure.blockquote-figure cite:empty:focus::before) {
    opacity: 0.5;
  }
  /* ── Callout blocks ──────────────────────────────────────── */
  :global(.ProseMirror .callout) {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin: 0.5rem 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: hsl(var(--muted) / 0.5);
  }
  :global(.ProseMirror .callout--info) {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.25);
  }
  :global(.ProseMirror .callout--warning) {
    background: rgba(234, 179, 8, 0.1);
    border-color: rgba(234, 179, 8, 0.3);
  }
  :global(.ProseMirror .callout--success) {
    background: rgba(34, 197, 94, 0.08);
    border-color: rgba(34, 197, 94, 0.25);
  }
  :global(.ProseMirror .callout--error) {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.25);
  }
  :global(.ProseMirror .callout__icon) {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.175rem;
    color: hsl(var(--muted-foreground));
  }
  :global(.ProseMirror .callout__icon svg) { stroke: currentColor; }
  :global(.ProseMirror .callout--info    .callout__icon) { color: rgb(59, 130, 246); }
  :global(.ProseMirror .callout--warning .callout__icon) { color: rgb(202, 138, 4); }
  :global(.ProseMirror .callout--success .callout__icon) { color: rgb(22, 163, 74); }
  :global(.ProseMirror .callout--error   .callout__icon) { color: rgb(220, 38, 38); }
  :global(.ProseMirror .callout__content) {
    flex: 1;
    min-width: 0;
  }
  :global(.ProseMirror .callout__content > p:first-child) { margin-top: 0; }
  :global(.ProseMirror .callout__content > p:last-child)  { margin-bottom: 0; }

  :global(.ProseMirror h1) { font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 0.5rem; line-height: 1.2; }
  :global(.ProseMirror h2) { font-size: 1.5rem;   font-weight: 600; margin: 1.25rem 0 0.4rem; line-height: 1.3; }
  :global(.ProseMirror h3) { font-size: 1.25rem;  font-weight: 600; margin: 1rem 0 0.3rem; line-height: 1.4; }
  :global(.ProseMirror ul) { list-style: disc;    padding-left: 1.5rem; }
  :global(.ProseMirror ol) { list-style: decimal; padding-left: 1.5rem; }
  :global(.ProseMirror li)  { margin: 0.2rem 0; }
  :global(.ProseMirror p)   { margin: 0.4rem 0; line-height: 1.7; }

  :global(.ProseMirror .comment-mark) {
    background-color: rgba(253, 224, 71, 0.3);
    border-bottom: 2px solid rgba(234, 179, 8, 0.7);
    border-radius: 2px;
    cursor: pointer;
    transition: background-color 0.15s;
  }
  :global(.ProseMirror .comment-mark:hover) {
    background-color: rgba(253, 224, 71, 0.55);
  }
  :global(.ProseMirror a) {
    color: hsl(217, 91%, 60%);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
    transition: color 0.15s;
  }
  :global(.ProseMirror a:hover) {
    color: hsl(217, 91%, 50%);
  }
</style>
