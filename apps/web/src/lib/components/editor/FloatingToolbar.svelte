<script lang="ts">
  import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom";
  import type { Editor } from "@tiptap/core";
  import {
    Bold, Italic, Strikethrough, Code, Quote,
    Link, AlignLeft, AlignCenter, AlignRight, Unlink, MessageSquare,
  } from "lucide-svelte";

  let {
    editor,
    onComment,
  }: {
    editor: Editor | null;
    onComment?: () => void;
  } = $props();

  let toolbarEl = $state<HTMLDivElement | undefined>();
  let visible = $state(false);
  let posX = $state(0);
  let posY = $state(0);

  let linkMode = $state(false);
  let linkValue = $state("");
  let linkInputEl = $state<HTMLInputElement | null>(null);

  let isBold = $state(false);
  let isItalic = $state(false);
  let isStrike = $state(false);
  let isCode = $state(false);
  let isBlockquote = $state(false);
  let isLink = $state(false);
  let currentLink = $state("");

  // ── Position via floating-ui ───────────────────────────────────────────────

  $effect(() => {
    if (!visible || !toolbarEl) return;

    const editorDom = editor?.view.dom;

    const virtualRef = {
      getBoundingClientRect: (): DOMRect => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) return new DOMRect();
        return sel.getRangeAt(0).getBoundingClientRect();
      },
      ...(editorDom ? { contextElement: editorDom } : {}),
    };

    const el = toolbarEl;

    async function update() {
      if (!el) return;
      const { x, y } = await computePosition(virtualRef, el, {
        placement: "top",
        middleware: [
          offset(8),
          flip({ padding: 8, fallbackPlacements: ["bottom"] }),
          shift({ padding: 8 }),
        ],
      });
      posX = x;
      posY = y;
    }

    const cleanup = autoUpdate(virtualRef, el, update, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
      layoutShift: false,
    });

    return cleanup;
  });

  // ── Editor selection tracking ──────────────────────────────────────────────

  function updateMarks() {
    if (!editor) return;
    isBold = editor.isActive("bold");
    isItalic = editor.isActive("italic");
    isStrike = editor.isActive("strike");
    isCode = editor.isActive("code");
    isBlockquote = editor.isActive("blockquote");
    isLink = editor.isActive("link");
    currentLink = editor.getAttributes("link").href ?? "";
  }

  function onSelectionChange() {
    if (!editor) return;
    const { selection } = editor.state;
    if (selection.empty) {
      visible = false;
      linkMode = false;
      return;
    }
    const ns = selection as unknown as { node?: { type: { name: string } } };
    if (ns.node?.type.name === "image") {
      visible = false;
      return;
    }
    updateMarks();
    visible = true;
  }

  $effect(() => {
    if (!editor) return;
    editor.on("selectionUpdate", onSelectionChange);
    editor.on("transaction", onSelectionChange);
    return () => {
      editor.off("selectionUpdate", onSelectionChange);
      editor.off("transaction", onSelectionChange);
    };
  });

  // ── Link handling ──────────────────────────────────────────────────────────

  function openLinkMode() {
    linkValue = currentLink;
    linkMode = true;
    setTimeout(() => linkInputEl?.focus(), 10);
  }

  function applyLink() {
    if (!editor) return;
    const href = linkValue.trim();
    if (!href) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = href.startsWith("http") ? href : `https://${href}`;
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
    linkMode = false;
    linkValue = "";
    updateMarks();
  }

  function removeLink() {
    editor?.chain().focus().unsetLink().run();
    linkMode = false;
    updateMarks();
  }

  function handleLinkKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); applyLink(); }
    if (e.key === "Escape") { linkMode = false; editor?.commands.focus(); }
  }

  function handleComment() {
    visible = false;
    linkMode = false;
    onComment?.();
  }

  // ── Keyboard shortcut ⌘K for link ─────────────────────────────────────────

  $effect(() => {
    function handleGlobalKeydown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === "k" && visible && !linkMode) {
        e.preventDefault();
        openLinkMode();
      }
    }
    document.addEventListener("keydown", handleGlobalKeydown);
    return () => document.removeEventListener("keydown", handleGlobalKeydown);
  });
</script>

{#if visible}
  <div
    bind:this={toolbarEl}
    role="toolbar"
    aria-label="Text formatting"
    class="floating-toolbar fixed z-40 flex items-center gap-0.5 rounded-lg border border-border bg-popover shadow-xl px-1.5 py-1"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
    onmousedown={(e) => e.preventDefault()}
  >
    {#if linkMode}
      <div class="flex items-center gap-1.5 px-1 w-72">
        <Link class="w-3.5 h-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
        <input
          bind:this={linkInputEl}
          bind:value={linkValue}
          onkeydown={handleLinkKeydown}
          type="url"
          placeholder="https://..."
          class="flex-1 min-w-0 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
        <button
          onclick={applyLink}
          class="shrink-0 text-xs font-medium px-2 py-0.5 rounded bg-foreground text-background hover:opacity-80 transition-opacity"
        >Apply</button>
        {#if isLink}
          <button
            onclick={removeLink}
            class="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
            title="Remove link"
          >
            <Unlink class="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        {/if}
      </div>
    {:else}
      <button onclick={() => { editor?.chain().focus().toggleBold().run(); updateMarks(); }} class="toolbar-btn" class:active={isBold} title="Bold (⌘B)">
        <Bold class="w-3.5 h-3.5" strokeWidth={isBold ? 3 : 2} />
      </button>
      <button onclick={() => { editor?.chain().focus().toggleItalic().run(); updateMarks(); }} class="toolbar-btn" class:active={isItalic} title="Italic (⌘I)">
        <Italic class="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <button onclick={() => { editor?.chain().focus().toggleStrike().run(); updateMarks(); }} class="toolbar-btn" class:active={isStrike} title="Strikethrough">
        <Strikethrough class="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <button onclick={() => { editor?.chain().focus().toggleCode().run(); updateMarks(); }} class="toolbar-btn" class:active={isCode} title="Inline Code">
        <Code class="w-3.5 h-3.5" strokeWidth={2} />
      </button>

      <div class="w-px h-5 bg-border mx-0.5 shrink-0"></div>

      <button onclick={openLinkMode} class="toolbar-btn" class:active={isLink} title="Link — ⌘K">
        <Link class="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <button onclick={() => { editor?.chain().focus().toggleBlockquote().run(); updateMarks(); }} class="toolbar-btn" class:active={isBlockquote} title="Blockquote">
        <Quote class="w-3.5 h-3.5" strokeWidth={2} />
      </button>

      <div class="w-px h-5 bg-border mx-0.5 shrink-0"></div>

      <button
        onclick={() => editor?.chain().focus().setTextAlign("left").run()}
        class="toolbar-btn"
        class:active={editor?.isActive({ textAlign: "left" })}
        title="Align left"
      >
        <AlignLeft class="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <button
        onclick={() => editor?.chain().focus().setTextAlign("center").run()}
        class="toolbar-btn"
        class:active={editor?.isActive({ textAlign: "center" })}
        title="Align center"
      >
        <AlignCenter class="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <button
        onclick={() => editor?.chain().focus().setTextAlign("right").run()}
        class="toolbar-btn"
        class:active={editor?.isActive({ textAlign: "right" })}
        title="Align right"
      >
        <AlignRight class="w-3.5 h-3.5" strokeWidth={2} />
      </button>

      {#if onComment}
        <div class="w-px h-5 bg-border mx-0.5 shrink-0"></div>
        <button onclick={handleComment} class="toolbar-btn" title="Add comment">
          <MessageSquare class="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    color: hsl(var(--muted-foreground));
    transition: background-color 0.1s, color 0.1s;
    flex-shrink: 0;
  }
  .toolbar-btn:hover {
    background-color: hsl(var(--accent));
    color: hsl(var(--foreground));
  }
  .toolbar-btn.active {
    background-color: hsl(var(--accent));
    color: hsl(var(--foreground));
  }
</style>
