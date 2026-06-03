<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { liveblocks } from "$lib/liveblocks.js";
  import { createEditor, uploadImage } from "$lib/editor.js";
  import { pageStore } from "$lib/stores/page.js";
  import { LiveblocksYjsProvider } from "@liveblocks/yjs";
  import * as Y from "yjs";
  import type { Editor } from "@tiptap/core";
  import VersionHistory from "./VersionHistory.svelte";

  interface Page {
    id: string;
    title: string;
    icon: string | null;
    coverImage: string | null;
    content: string | null;
    workspaceId: string;
    parentId: string | null;
    createdBy: string;
  }

  let {
    page,
    userName,
    onTitleChange,
  }: {
    page: Page;
    userName: string;
    onTitleChange: (title: string) => void;
  } = $props();

  let editorEl: HTMLDivElement;
  let editor: Editor | null = null;
  let ydoc: Y.Doc | null = null;
  let provider: LiveblocksYjsProvider | null = null;
  let titleValue = $state(page.title);
  let titleTimeout: ReturnType<typeof setTimeout>;

  // ── Version history state ─────────────────────────────────────────────────
  let historyOpen = $state(false);
  let savingVersion = $state(false);
  let versionSavedMsg = $state(false);

  // ── Fallback auto-save state ──────────────────────────────────────────────
  // "initial" | "connecting" | "connected" | "reconnecting" | "disconnected"
  let liveblocksStatus = $state<string>("initial");
  let autoSaveStatus = $state<"idle" | "saving" | "saved" | "error">("idle");
  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
  let unsubStatus: (() => void) | null = null;

  // ── Fallback auto-save logic ──────────────────────────────────────────────
  function scheduleAutoSave() {
    // When Liveblocks is live, it handles syncing — no need to hit the DB
    if (liveblocksStatus === "connected") return;
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(doAutoSave, 2000);
  }

  async function doAutoSave() {
    if (!editor || liveblocksStatus === "connected") return;
    autoSaveStatus = "saving";
    try {
      const content = JSON.stringify(editor.getJSON());
      await pageStore.updatePage(page.id, { content });
      autoSaveStatus = "saved";
      setTimeout(() => {
        if (autoSaveStatus === "saved") autoSaveStatus = "idle";
      }, 2500);
    } catch {
      autoSaveStatus = "error";
    }
  }

  // ── Title input ──────────────────────────────────────────────────────────
  function handleTitleInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    titleValue = val;
    clearTimeout(titleTimeout);
    titleTimeout = setTimeout(() => onTitleChange(val), 500);
  }

  // ── Image upload ─────────────────────────────────────────────────────────
  async function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
    input.click();
  }

  // ── Manual version snapshot ───────────────────────────────────────────────
  async function saveVersion() {
    if (!editor) return;
    savingVersion = true;
    try {
      const content = JSON.stringify(editor.getJSON());
      const res = await fetch(`/api/pages/${page.id}/versions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleValue, content }),
      });
      if (!res.ok) throw new Error("Server error");
      versionSavedMsg = true;
      setTimeout(() => (versionSavedMsg = false), 2500);
    } catch (err) {
      console.error("Failed to save version", err);
    } finally {
      savingVersion = false;
    }
  }

  // ── Restore from version history ──────────────────────────────────────────
  function handleRestore(version: { title: string; content: string }) {
    titleValue = version.title;
    onTitleChange(version.title);
    if (editor) {
      try {
        const doc = JSON.parse(version.content);
        editor.commands.setContent(doc);
      } catch {
        // ignore malformed content
      }
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  onMount(async () => {
    ydoc = new Y.Doc();
    const room = liveblocks.enterRoom(page.id);

    // Track Liveblocks connection status for fallback save decisions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unsubStatus = (room as any).subscribe("status", (status: string) => {
      const wasConnected = liveblocksStatus === "connected";
      liveblocksStatus = status;
      // Liveblocks just dropped → immediately schedule a save
      if (wasConnected && status !== "connected" && editor) {
        scheduleAutoSave();
      }
    });

    provider = new LiveblocksYjsProvider(room, ydoc);

    editor = createEditor({
      element: editorEl,
      ydoc,
      provider,
      userName,
      placeholder: "Start writing, or press / for commands…",
    });

    // Auto-save on every local edit when Liveblocks is offline.
    // Skip remote Yjs syncs (meta "y-sync$") to avoid write conflicts.
    editor.on("update", ({ transaction }) => {
      if ((transaction as any).getMeta("y-sync$")) return;
      scheduleAutoSave();
    });
  });

  onDestroy(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    clearTimeout(titleTimeout);
    unsubStatus?.();
    editor?.destroy();
    provider?.destroy();
    ydoc?.destroy();
  });
</script>

<div class="max-w-3xl mx-auto px-8 py-12">
  <!-- Cover image -->
  {#if page.coverImage}
    <div class="relative -mx-8 mb-8 h-48 overflow-hidden rounded-b-lg">
      <img src={page.coverImage} alt="Cover" class="w-full h-full object-cover" />
    </div>
  {/if}

  <!-- Icon -->
  {#if page.icon}
    <div class="text-5xl mb-4 leading-none">{page.icon}</div>
  {/if}

  <!-- Title -->
  <input
    type="text"
    value={titleValue}
    oninput={handleTitleInput}
    placeholder="Untitled"
    class="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground mb-6 resize-none"
  />

  <!-- Toolbar -->
  <div class="flex items-center gap-2 mb-4 pb-2 border-b border-border">
    <button
      onclick={handleImageUpload}
      class="text-xs px-2 py-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title="Upload image"
    >
      🖼️ Image
    </button>

    <div class="flex-1"></div>

    <!-- Save version feedback -->
    {#if versionSavedMsg}
      <span class="text-xs text-green-600 font-medium">✓ Version saved</span>
    {/if}

    <button
      onclick={saveVersion}
      disabled={savingVersion}
      class="text-xs px-2 py-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      title="Save a version snapshot"
    >
      {savingVersion ? "Saving…" : "💾 Save version"}
    </button>

    <button
      onclick={() => (historyOpen = true)}
      class="text-xs px-2 py-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title="View version history"
    >
      🕐 History
    </button>

    <!-- Connection + auto-save status indicator -->
    {#if liveblocksStatus === "connected"}
      <span class="text-xs text-muted-foreground flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        Live
      </span>
    {:else if autoSaveStatus === "saving"}
      <span class="text-xs text-muted-foreground flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
        Auto-saving…
      </span>
    {:else if autoSaveStatus === "saved"}
      <span class="text-xs text-green-600 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        Saved locally
      </span>
    {:else if autoSaveStatus === "error"}
      <span class="text-xs text-destructive flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        Save failed
      </span>
    {:else}
      <span class="text-xs text-muted-foreground flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
        {liveblocksStatus === "connecting" || liveblocksStatus === "initial"
          ? "Connecting…"
          : "Offline"}
      </span>
    {/if}
  </div>

  <!-- Editor mount point -->
  <div bind:this={editorEl} class="prose prose-neutral max-w-none min-h-[400px]"></div>
</div>

<!-- Version history panel -->
<VersionHistory
  pageId={page.id}
  bind:open={historyOpen}
  onRestore={handleRestore}
/>
