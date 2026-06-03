<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { createEditor } from "$lib/editor.js";
  import type { Editor } from "@tiptap/core";
  import type { Page } from "$lib/stores/page.js";

  let {
    page,
    onUpdate,
    editor = $bindable(null),
    imageSelected = $bindable(false),
    imageBubble = $bindable(null),
    onOpenContextMenu,
    onCommentClick,
  }: {
    page: Page;
    onUpdate: (json: string) => void;
    editor?: Editor | null;
    imageSelected?: boolean;
    imageBubble?: { left: number; top: number } | null;
    onOpenContextMenu?: (data: { x: number; y: number; blockPos: number | null }) => void;
    onCommentClick?: (commentId: string) => void;
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
          const rect = domNode.getBoundingClientRect();
          imageBubble = {
            left: Math.max(4, rect.left + rect.width / 2 - 96),
            top: rect.bottom + 8,
          };
        } else {
          const coords = editor.view.coordsAtPos(selection.from);
          imageBubble = { left: coords.left, top: coords.bottom + 8 };
        }
        imageSelected = true;
      } catch {
        imageSelected = false;
      }
    } else {
      imageSelected = false;
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
  onmouseover={handleMouseOver}
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
      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
        <circle cx="2.5" cy="2"  r="1.5"/>
        <circle cx="7.5" cy="2"  r="1.5"/>
        <circle cx="2.5" cy="7"  r="1.5"/>
        <circle cx="7.5" cy="7"  r="1.5"/>
        <circle cx="2.5" cy="12" r="1.5"/>
        <circle cx="7.5" cy="12" r="1.5"/>
      </svg>
    </button>
  {/if}

  <div
    bind:this={editorEl}
    onclick={(e) => {
      const target = e.target as HTMLElement;
      const markEl = target.closest("[data-comment-id]") as HTMLElement | null;
      if (markEl) {
        const commentId = markEl.getAttribute("data-comment-id");
        if (commentId) onCommentClick?.(commentId);
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
  :global(.ProseMirror img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  :global(.ProseMirror img.ProseMirror-selectednode) {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
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
  :global(.ProseMirror blockquote) {
    border-left: 3px solid hsl(var(--border));
    padding-left: 1rem;
    margin-left: 0;
    color: hsl(var(--muted-foreground));
    font-style: italic;
  }
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
</style>
