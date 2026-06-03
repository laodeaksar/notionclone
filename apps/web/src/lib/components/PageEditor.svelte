<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { createEditor, uploadImage, slashMenuStore } from "$lib/editor.js";
  import type { Editor } from "@tiptap/core";
  import VersionHistory from "./VersionHistory.svelte";
  import type { Page } from "$lib/stores/page.js";

  let {
    page,
    onTitleChange,
  }: {
    page: Page;
    onTitleChange?: (title: string) => void;
  } = $props();

  // DOM refs
  let editorEl = $state<HTMLDivElement | null>(null);
  let editorWrapperEl = $state<HTMLDivElement | null>(null);

  // Editor instance
  let editor = $state<Editor | null>(null);

  // Title
  let titleValue = $state(page.title ?? "");
  let titleTimer: ReturnType<typeof setTimeout>;
  let saveTimer: ReturnType<typeof setTimeout>;

  // Version history
  let historyOpen = $state(false);
  let savingVersion = $state(false);
  let versionSavedMsg = $state(false);

  // ── Image bubble menu (shown when image node is selected) ─────────────────
  let imageSelected = $state(false);
  let imageBubble = $state<{ left: number; top: number } | null>(null);

  // ── Drag-handle context menu ──────────────────────────────────────────────
  let dragVisible = $state(false);
  let dragStyle = $state("");
  let hoveredBlockEl = $state<Element | null>(null);

  let ctxOpen = $state(false);
  let ctxX = $state(0);
  let ctxY = $state(0);
  let ctxBlockPos = $state<number | null>(null);

  // ── Slash dropdown menu (driven by store from editor.ts) ──────────────────
  let slash = $derived($slashMenuStore);

  // ─────────────────────────────────────────────────────────────────────────
  // Title
  // ─────────────────────────────────────────────────────────────────────────
  function handleTitleInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    titleValue = val;
    clearTimeout(titleTimer);
    titleTimer = setTimeout(() => onTitleChange?.(val), 400);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Content auto-save (debounced 1 s)
  // ─────────────────────────────────────────────────────────────────────────
  async function saveContent(json: string) {
    try {
      await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: json }),
      });
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Image upload button
  // ─────────────────────────────────────────────────────────────────────────
  function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/gif,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    };
    input.click();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Image align button (bubble menu actions)
  // ─────────────────────────────────────────────────────────────────────────
  function setImageAlign(align: string) {
    editor?.chain().focus().updateAttributes("image", { align }).run();
  }

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

  // ─────────────────────────────────────────────────────────────────────────
  // Version management
  // ─────────────────────────────────────────────────────────────────────────
  async function saveVersion() {
    if (!editor) return;
    savingVersion = true;
    try {
      await fetch(`/api/pages/${page.id}/versions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleValue,
          content: JSON.stringify(editor.getJSON()),
        }),
      });
      versionSavedMsg = true;
      setTimeout(() => (versionSavedMsg = false), 2500);
    } catch (err) {
      console.error("Version save failed:", err);
    } finally {
      savingVersion = false;
    }
  }

  function handleRestore(version: { title: string; content: string }) {
    titleValue = version.title;
    onTitleChange?.(version.title);
    if (editor && version.content) {
      try { editor.commands.setContent(JSON.parse(version.content)); } catch {}
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Drag-context-menu: hover detection + context menu actions
  // ─────────────────────────────────────────────────────────────────────────
  function handleEditorMouseOver(e: MouseEvent) {
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

  function handleEditorMouseLeave(e: MouseEvent) {
    const rel = e.relatedTarget as Element | null;
    if (!rel || !editorWrapperEl?.contains(rel)) dragVisible = false;
  }

  function openCtx(e: MouseEvent) {
    e.stopPropagation();
    if (hoveredBlockEl && editor) {
      const r = hoveredBlockEl.getBoundingClientRect();
      const hit = editor.view.posAtCoords({ left: r.left + 4, top: r.top + r.height / 2 });
      ctxBlockPos = hit?.pos ?? null;
    }
    ctxX = e.clientX;
    ctxY = e.clientY;
    ctxOpen = true;
    dragVisible = false;
  }

  function closeCtx() { ctxOpen = false; }

  function deleteBlock() {
    if (!editor || ctxBlockPos === null) { closeCtx(); return; }
    try {
      const $pos = editor.state.doc.resolve(ctxBlockPos);
      const from = $pos.start(1) - 1;
      const to = $pos.end(1) + 1;
      editor.chain().focus().deleteRange({ from, to }).run();
    } catch {}
    closeCtx();
  }

  function duplicateBlock() {
    if (!editor || ctxBlockPos === null) { closeCtx(); return; }
    try {
      const $pos = editor.state.doc.resolve(ctxBlockPos);
      const node = $pos.node(1);
      if (node) {
        const to = $pos.end(1) + 1;
        editor.chain().focus().insertContentAt(to, node.toJSON()).run();
      }
    } catch {}
    closeCtx();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Slash command execution
  // ─────────────────────────────────────────────────────────────────────────
  function execSlash(item: typeof slash.items[number]) {
    slash.executeCommand?.(item);
    slashMenuStore.update((s) => ({ ...s, open: false }));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────
  onMount(() => {
    if (!editorEl) return;
    const inst = createEditor({
      element: editorEl,
      content: page.content,
      onUpdate: (json) => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => saveContent(json), 1000);
      },
    });
    editor = inst;
    inst.on("selectionUpdate", checkImageSelection);
    inst.on("transaction", checkImageSelection);
  });

  onDestroy(() => {
    clearTimeout(titleTimer);
    clearTimeout(saveTimer);
    editor?.destroy();
  });
</script>

<!-- Close popups on outside click -->
<svelte:window
  onclick={(e) => {
    if (ctxOpen && !(e.target as Element)?.closest(".ctx-menu")) closeCtx();
    if (slash.open && !(e.target as Element)?.closest(".slash-menu")) {
      slashMenuStore.update((s) => ({ ...s, open: false }));
    }
  }}
/>

<div class="max-w-3xl mx-auto px-8 pb-24">
  <!-- Cover image -->
  {#if page.coverImage}
    <div class="relative -mx-8 h-52 overflow-hidden mb-8">
      <img src={page.coverImage} alt="Cover" class="w-full h-full object-cover" />
    </div>
  {/if}

  <!-- Page icon -->
  {#if page.icon}
    <div class="text-5xl mb-4 leading-none select-none">{page.icon}</div>
  {/if}

  <!-- Title -->
  <input
    type="text"
    value={titleValue}
    oninput={handleTitleInput}
    placeholder="Untitled"
    class="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground mb-6"
  />

  <!-- ── Toolbar ─────────────────────────────────────────────────────────── -->
  <div class="flex items-center gap-1 mb-4 pb-3 border-b border-border text-muted-foreground">
    <!-- Image upload button -->
    <button
      onclick={handleImageUpload}
      class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors"
      title="Upload image (also supports drag-drop &amp; paste into editor)"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
      Image
    </button>

    <div class="flex-1"></div>

    {#if versionSavedMsg}
      <span class="text-xs text-green-600 font-medium px-2">✓ Saved</span>
    {/if}

    <button
      onclick={saveVersion}
      disabled={savingVersion}
      class="px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
    >
      {savingVersion ? "Saving…" : "Save version"}
    </button>

    <button
      onclick={() => (historyOpen = true)}
      class="px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors"
    >
      History
    </button>
  </div>

  <!-- ── Editor + drag handle ───────────────────────────────────────────── -->
  <div
    bind:this={editorWrapperEl}
    onmouseover={handleEditorMouseOver}
    onmouseleave={handleEditorMouseLeave}
  >
    <!-- Drag context menu handle (⣿ icon, appears on block hover) -->
    {#if dragVisible}
      <button
        type="button"
        style={dragStyle}
        onclick={openCtx}
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

    <!-- Tiptap mount point -->
    <div
      bind:this={editorEl}
      class="prose prose-neutral dark:prose-invert max-w-none min-h-96"
    ></div>
  </div>
</div>

<!-- ── Image align bubble menu ────────────────────────────────────────────── -->
{#if imageSelected && imageBubble}
  <div
    class="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border
           bg-popover p-1 shadow-md"
    style="left:{imageBubble.left}px;top:{imageBubble.top}px;"
  >
    <!-- Align left -->
    <button onclick={() => setImageAlign("left")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent
             text-muted-foreground hover:text-foreground transition-colors"
      title="Align left">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="3" y1="12" x2="15" y2="12"/>
        <line x1="3" y1="18" x2="18" y2="18"/>
      </svg>
    </button>

    <!-- Align center -->
    <button onclick={() => setImageAlign("center")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent
             text-muted-foreground hover:text-foreground transition-colors"
      title="Align center">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="6" y1="12" x2="18" y2="12"/>
        <line x1="4" y1="18" x2="20" y2="18"/>
      </svg>
    </button>

    <!-- Align right -->
    <button onclick={() => setImageAlign("right")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent
             text-muted-foreground hover:text-foreground transition-colors"
      title="Align right">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="9" y1="12" x2="21" y2="12"/>
        <line x1="6" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <div class="w-px h-5 bg-border mx-0.5"></div>

    <!-- Full width -->
    <button onclick={() => setImageAlign("full-width")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent
             text-muted-foreground hover:text-foreground transition-colors"
      title="Full width">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="15 3 21 3 21 9"/>
        <polyline points="9 21 3 21 3 15"/>
        <line x1="21" y1="3" x2="14" y2="10"/>
        <line x1="3"  y1="21" x2="10" y2="14"/>
      </svg>
    </button>
  </div>
{/if}

<!-- ── Drag-handle context menu ───────────────────────────────────────────── -->
{#if ctxOpen}
  <div
    class="ctx-menu fixed z-50 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-lg"
    style="left:{ctxX}px;top:{ctxY}px;"
  >
    <button
      onclick={duplicateBlock}
      class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm
             text-foreground hover:bg-accent transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="8" y="8" width="12" height="12" rx="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
      Duplicate block
    </button>
    <button
      onclick={deleteBlock}
      class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm
             text-destructive hover:bg-destructive/10 transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
      Delete block
    </button>
  </div>
{/if}

<!-- ── Slash dropdown menu ────────────────────────────────────────────────── -->
{#if slash.open && slash.coords && slash.items.length > 0}
  <div
    class="slash-menu fixed z-50 w-72 rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
    style="left:{slash.coords.left}px;top:{slash.coords.top}px;"
  >
    <div class="px-3 py-2 border-b border-border">
      <p class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Blocks
      </p>
    </div>

    <div class="max-h-64 overflow-y-auto p-1">
      {#each slash.items as item, i (item.title)}
        <button
          onclick={() => execSlash(item)}
          class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-left transition-colors"
          class:bg-accent={i === slash.selectedIndex}
          class:text-accent-foreground={i === slash.selectedIndex}
          class:text-foreground={i !== slash.selectedIndex}
          class:hover:bg-accent={i !== slash.selectedIndex}
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border
                      bg-background font-mono text-xs font-bold text-muted-foreground">
            {item.icon}
          </div>
          <div class="min-w-0">
            <p class="font-medium leading-tight">{item.title}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{item.description}</p>
          </div>
        </button>
      {/each}
    </div>

    <div class="px-3 py-1.5 border-t border-border">
      <p class="text-[10px] text-muted-foreground">↑↓ navigate · Enter select · Esc close</p>
    </div>
  </div>
{/if}

<!-- ── Version history side panel ─────────────────────────────────────────── -->
<VersionHistory
  pageId={page.id}
  bind:open={historyOpen}
  onRestore={handleRestore}
/>

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
</style>
