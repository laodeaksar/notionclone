<script lang="ts">
  import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom";
  import type { Editor } from "@tiptap/core";
  import {
    Bold, Italic, Strikethrough, Code,
    Link, Unlink, MessageSquare, ChevronDown,
    Pilcrow, Heading1, Heading2, Heading3,
    Quote, Code2, List, ListOrdered,
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
  let commentActive = $state(false);

  let isBold = $state(false);
  let isItalic = $state(false);
  let isStrike = $state(false);
  let isCode = $state(false);
  let isLink = $state(false);
  let currentLink = $state("");

  // ── "Turn into" dropdown ───────────────────────────────────────────────────

  let turnIntoOpen = $state(false);
  let turnIntoBtnEl = $state<HTMLButtonElement | null>(null);
  let turnIntoDropEl = $state<HTMLDivElement | null>(null);
  let dropX = $state(0);
  let dropY = $state(0);

  type BlockType = "text" | "h1" | "h2" | "h3" | "quote" | "code" | "bullet" | "ordered";

  let currentBlock = $state<BlockType>("text");

  const BLOCK_TYPES: { id: BlockType; label: string; icon: typeof Pilcrow; command: () => void }[] = [
    { id: "text",    label: "Text",        icon: Pilcrow,      command: () => editor?.chain().focus().setParagraph().run() },
    { id: "h1",      label: "Heading 1",   icon: Heading1,     command: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { id: "h2",      label: "Heading 2",   icon: Heading2,     command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { id: "h3",      label: "Heading 3",   icon: Heading3,     command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { id: "quote",   label: "Quote",       icon: Quote,        command: () => editor?.chain().focus().toggleBlockquote().run() },
    { id: "code",    label: "Code block",  icon: Code2,        command: () => editor?.chain().focus().toggleCodeBlock().run() },
    { id: "bullet",  label: "Bullet list", icon: List,         command: () => editor?.chain().focus().toggleBulletList().run() },
    { id: "ordered", label: "Numbered list", icon: ListOrdered, command: () => editor?.chain().focus().toggleOrderedList().run() },
  ];

  function updateCurrentBlock() {
    if (!editor) return;
    if (editor.isActive("heading", { level: 1 })) { currentBlock = "h1"; return; }
    if (editor.isActive("heading", { level: 2 })) { currentBlock = "h2"; return; }
    if (editor.isActive("heading", { level: 3 })) { currentBlock = "h3"; return; }
    if (editor.isActive("blockquote"))             { currentBlock = "quote"; return; }
    if (editor.isActive("codeBlock"))              { currentBlock = "code"; return; }
    if (editor.isActive("bulletList"))             { currentBlock = "bullet"; return; }
    if (editor.isActive("orderedList"))            { currentBlock = "ordered"; return; }
    currentBlock = "text";
  }

  // Position the "Turn into" dropdown anchored to its button
  $effect(() => {
    if (!turnIntoOpen || !turnIntoBtnEl || !turnIntoDropEl) return;
    const btn = turnIntoBtnEl;
    const drop = turnIntoDropEl;

    async function update() {
      const { x, y } = await computePosition(btn, drop, {
        placement: "bottom-start",
        middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
      });
      dropX = x;
      dropY = y;
    }

    const cleanup = autoUpdate(btn, drop, update);
    return cleanup;
  });

  // Close dropdown on outside click
  $effect(() => {
    if (!turnIntoOpen) return;
    function onOutside(e: MouseEvent) {
      if (!turnIntoDropEl?.contains(e.target as Node) && !turnIntoBtnEl?.contains(e.target as Node)) {
        turnIntoOpen = false;
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  });

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy() { node.remove(); } };
  }

  function applyBlockType(type: BlockType) {
    const bt = BLOCK_TYPES.find((b) => b.id === type);
    bt?.command();
    turnIntoOpen = false;
    currentBlock = type;
  }

  // ── Position toolbar below the selection ──────────────────────────────────

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
        placement: "bottom",
        middleware: [
          offset(8),
          flip({ padding: 8, fallbackPlacements: ["top"] }),
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
    isLink = editor.isActive("link");
    currentLink = editor.getAttributes("link").href ?? "";
    updateCurrentBlock();
  }

  function onSelectionChange() {
    if (!editor) return;
    const { selection } = editor.state;
    if (selection.empty) {
      visible = false;
      linkMode = false;
      turnIntoOpen = false;
      commentActive = false;
      return;
    }
    if (commentActive) return;
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
    commentActive = true;
    visible = false;
    linkMode = false;
    turnIntoOpen = false;
    onComment?.();
  }

  // ── ⌘K for link ───────────────────────────────────────────────────────────

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

  const currentBlockLabel = $derived(BLOCK_TYPES.find((b) => b.id === currentBlock)?.label ?? "Text");
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
      <!-- Link edit mode -->
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
      <!-- "Turn into" block type selector -->
      <button
        bind:this={turnIntoBtnEl}
        onclick={() => (turnIntoOpen = !turnIntoOpen)}
        class="turn-into-btn"
        class:active={turnIntoOpen}
        title="Turn into…"
      >
        <span class="text-xs font-medium leading-none">{currentBlockLabel}</span>
        <ChevronDown class="w-3 h-3 shrink-0 transition-transform duration-150 {turnIntoOpen ? 'rotate-180' : ''}" strokeWidth={2} />
      </button>

      <div class="w-px h-5 bg-border mx-0.5 shrink-0"></div>

      <!-- Inline marks -->
      <button onclick={() => { editor?.chain().focus().toggleBold().run(); updateMarks(); }} class="toolbar-btn" class:active={isBold} title="Bold (⌘B)">
        <Bold class="w-3.5 h-3.5" strokeWidth={isBold ? 3 : 2} />
      </button>
      <button onclick={() => { editor?.chain().focus().toggleItalic().run(); updateMarks(); }} class="toolbar-btn" class:active={isItalic} title="Italic (⌘I)">
        <Italic class="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <button onclick={() => { editor?.chain().focus().toggleStrike().run(); updateMarks(); }} class="toolbar-btn" class:active={isStrike} title="Strikethrough">
        <Strikethrough class="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <button onclick={() => { editor?.chain().focus().toggleCode().run(); updateMarks(); }} class="toolbar-btn" class:active={isCode} title="Inline code">
        <Code class="w-3.5 h-3.5" strokeWidth={2} />
      </button>

      <div class="w-px h-5 bg-border mx-0.5 shrink-0"></div>

      <button onclick={openLinkMode} class="toolbar-btn" class:active={isLink} title="Link — ⌘K">
        <Link class="w-3.5 h-3.5" strokeWidth={2} />
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

<!-- "Turn into" dropdown — portalled to body so it's never clipped -->
{#if turnIntoOpen}
  <div
    bind:this={turnIntoDropEl}
    use:portal
    role="menu"
    aria-label="Turn into"
    class="fixed z-50 min-w-[180px] rounded-lg border border-border bg-popover shadow-xl py-1 overflow-hidden"
    style:top="0"
    style:left="0"
    style:transform="translate({dropX}px, {dropY}px)"
    onmousedown={(e) => e.preventDefault()}
  >
    <p class="px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      Turn into
    </p>
    {#each BLOCK_TYPES as bt (bt.id)}
      <button
        role="menuitem"
        onclick={() => applyBlockType(bt.id)}
        class="flex items-center gap-2.5 w-full px-3 py-1.5 text-sm text-left transition-colors
               hover:bg-accent hover:text-foreground
               {currentBlock === bt.id ? 'bg-accent/60 text-foreground font-medium' : 'text-muted-foreground'}"
      >
        <bt.icon class="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
        {bt.label}
        {#if currentBlock === bt.id}
          <span class="ml-auto text-[10px] text-muted-foreground/60">current</span>
        {/if}
      </button>
    {/each}
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
  .toolbar-btn:hover,
  .toolbar-btn.active {
    background-color: hsl(var(--accent));
    color: hsl(var(--foreground));
  }

  .turn-into-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.5rem;
    height: 2rem;
    border-radius: 0.375rem;
    color: hsl(var(--muted-foreground));
    transition: background-color 0.1s, color 0.1s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .turn-into-btn:hover,
  .turn-into-btn.active {
    background-color: hsl(var(--accent));
    color: hsl(var(--foreground));
  }
</style>
