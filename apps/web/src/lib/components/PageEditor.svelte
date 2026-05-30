<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { liveblocks } from "$lib/liveblocks.js";
  import { createEditor, uploadImage } from "$lib/editor.js";
  import { LiveblocksYjsProvider } from "@liveblocks/yjs";
  import * as Y from "yjs";
  import type { Editor } from "@tiptap/core";

  interface Page {
    id: string;
    title: string;
    icon: string | null;
    coverImage: string | null;
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

  function handleTitleInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    titleValue = val;
    clearTimeout(titleTimeout);
    titleTimeout = setTimeout(() => onTitleChange(val), 500);
  }

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

  onMount(async () => {
    // Set up Yjs + Liveblocks
    ydoc = new Y.Doc();
    const room = liveblocks.enterRoom(page.id);
    provider = new LiveblocksYjsProvider(room, ydoc);

    editor = createEditor({
      element: editorEl,
      ydoc,
      provider,
      userName,
      placeholder: "Start writing, or press / for commands…",
    });
  });

  onDestroy(() => {
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
    <span class="text-xs text-muted-foreground">Real-time collaboration enabled</span>
  </div>

  <!-- Editor mount point -->
  <div bind:this={editorEl} class="prose prose-neutral max-w-none min-h-[400px]"></div>
</div>
