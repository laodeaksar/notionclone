<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { uploadImage, slashMenuStore } from "$lib/editor.js";
  import {
    updatePageFn,
    saveVersionFn,
    commentsQueryOptions,
    type PageVersion,
    type CommentThread,
  } from "$lib/queries.js";
  import { useSession } from "$lib/auth-client.js";
  import type { Editor } from "@tiptap/core";
  import type { Page } from "$lib/stores/page.js";

  import PageHeader from "./editor/PageHeader.svelte";
  import EditorToolbar from "./editor/EditorToolbar.svelte";
  import EditorArea from "./editor/EditorArea.svelte";
  import ImageBubbleMenu from "./editor/ImageBubbleMenu.svelte";
  import BlockContextMenu from "./editor/BlockContextMenu.svelte";
  import SlashMenu from "./editor/SlashMenu.svelte";
  import VersionHistory from "./VersionHistory.svelte";
  import CommentBubble from "./editor/CommentBubble.svelte";
  import CommentPanel from "./editor/CommentPanel.svelte";

  let {
    page,
    onTitleChange,
    onRestore,
  }: {
    page: Page;
    onTitleChange?: (title: string) => void;
    onRestore?: () => void;
  } = $props();

  // ── Auth ───────────────────────────────────────────────────────────────────
  const session = useSession();
  let currentUserId = $derived((session as any).data?.user?.id ?? "");

  // ── State ──────────────────────────────────────────────────────────────────
  let editor = $state<Editor | null>(null);
  let imageSelected = $state(false);
  let imageBubble = $state<{ left: number; top: number } | null>(null);

  let titleValue = $state("");
  let titleTimer: ReturnType<typeof setTimeout>;
  let saveTimer: ReturnType<typeof setTimeout>;

  $effect(() => {
    page.id;
    untrack(() => { titleValue = page.title ?? ""; });
  });

  let historyOpen = $state(false);
  let commentPanelOpen = $state(false);
  let activeCommentId = $state<string | null>(null);

  let ctxOpen = $state(false);
  let ctxX = $state(0);
  let ctxY = $state(0);
  let ctxBlockPos = $state<number | null>(null);

  let slash = $derived($slashMenuStore);

  // ── Comments count for badge ───────────────────────────────────────────────
  const commentsQuery = createQuery(() =>
    commentsQueryOptions(page.id, commentPanelOpen)
  );
  let openCommentCount = $derived(
    (commentsQuery.data ?? []).filter((c) => !c.resolved).length
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const saveContent = createMutation(() => ({ mutationFn: updatePageFn }));
  const saveVersion = createMutation(() => ({ mutationFn: saveVersionFn }));

  // ── Title ──────────────────────────────────────────────────────────────────
  function handleTitleInput(val: string) {
    titleValue = val;
    clearTimeout(titleTimer);
    titleTimer = setTimeout(() => onTitleChange?.(val), 400);
  }

  // ── Content auto-save (debounced 1 s) ─────────────────────────────────────
  function scheduleContentSave(json: string) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveContent.mutate({ id: page.id, content: json });
    }, 1000);
  }

  // ── Image upload ──────────────────────────────────────────────────────────
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

  // ── Image align ───────────────────────────────────────────────────────────
  function setImageAlign(align: string) {
    editor?.chain().focus().updateAttributes("image", { align }).run();
  }

  // ── Version save ──────────────────────────────────────────────────────────
  async function handleSaveVersion() {
    if (!editor) return;
    await saveVersion.mutateAsync({
      pageId: page.id,
      title: titleValue,
      content: JSON.stringify(editor.getJSON()),
    });
  }

  // ── Version restore ───────────────────────────────────────────────────────
  function handleRestore(version: PageVersion) {
    titleValue = version.title;
    onTitleChange?.(version.title);
    if (editor && version.content) {
      try {
        editor.commands.setContent(JSON.parse(version.content));
      } catch {}
    }
    onRestore?.();
  }

  // ── Block context menu ────────────────────────────────────────────────────
  function openContextMenu({ x, y, blockPos }: { x: number; y: number; blockPos: number | null }) {
    ctxX = x;
    ctxY = y;
    ctxBlockPos = blockPos;
    ctxOpen = true;
  }

  function closeCtx() { ctxOpen = false; }

  function deleteBlock() {
    if (!editor || ctxBlockPos === null) { closeCtx(); return; }
    try {
      const resolvedPos = editor.state.doc.resolve(ctxBlockPos);
      const from = resolvedPos.start(1) - 1;
      const to = resolvedPos.end(1) + 1;
      editor.chain().focus().deleteRange({ from, to }).run();
    } catch {}
    closeCtx();
  }

  function duplicateBlock() {
    if (!editor || ctxBlockPos === null) { closeCtx(); return; }
    try {
      const resolvedPos = editor.state.doc.resolve(ctxBlockPos);
      const node = resolvedPos.node(1);
      if (node) {
        const to = resolvedPos.end(1) + 1;
        editor.chain().focus().insertContentAt(to, node.toJSON()).run();
      }
    } catch {}
    closeCtx();
  }

  // ── Comment handlers ──────────────────────────────────────────────────────
  function handleCommentCreated(comment: CommentThread) {
    activeCommentId = comment.id;
    commentPanelOpen = true;
  }

  function handleCommentClick(commentId: string) {
    activeCommentId = commentId;
    commentPanelOpen = true;
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────
  onDestroy(() => {
    clearTimeout(titleTimer);
    clearTimeout(saveTimer);
  });

  // ── Title focus shortcut (Cmd/Ctrl+Shift+R) ────────────────────────────────
  let headerComp = $state<{ focusTitle: () => void } | null>(null);

  function handleRenameShortcut(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "R") {
      e.preventDefault();
      headerComp?.focusTitle();
    }
  }
</script>

<svelte:window
  onclick={(e) => {
    if (ctxOpen && !(e.target as Element)?.closest(".ctx-menu")) closeCtx();
    if (slash.open && !(e.target as Element)?.closest(".slash-menu")) {
      slashMenuStore.update((s) => ({ ...s, open: false }));
    }
  }}
  onkeydown={handleRenameShortcut}
/>

<div class="max-w-3xl mx-auto px-8 pb-24">
  <PageHeader bind:this={headerComp} {page} {titleValue} onTitleInput={handleTitleInput} />

  <EditorToolbar
    saveIsPending={saveContent.isPending}
    saveIsError={saveContent.isError}
    versionIsPending={saveVersion.isPending}
    versionIsSuccess={saveVersion.isSuccess}
    {commentPanelOpen}
    commentCount={openCommentCount}
    onImageUpload={handleImageUpload}
    onSaveVersion={handleSaveVersion}
    onOpenHistory={() => (historyOpen = true)}
    onToggleComments={() => (commentPanelOpen = !commentPanelOpen)}
  />

  <EditorArea
    {page}
    onUpdate={scheduleContentSave}
    bind:editor
    bind:imageSelected
    bind:imageBubble
    onOpenContextMenu={openContextMenu}
    onCommentClick={handleCommentClick}
  />
</div>

<ImageBubbleMenu
  visible={imageSelected}
  position={imageBubble}
  onAlign={setImageAlign}
/>

<BlockContextMenu
  open={ctxOpen}
  x={ctxX}
  y={ctxY}
  onClose={closeCtx}
  onDuplicate={duplicateBlock}
  onDelete={deleteBlock}
/>

<SlashMenu {slash} />

<VersionHistory
  pageId={page.id}
  bind:open={historyOpen}
  onRestore={handleRestore}
/>

<CommentBubble
  {editor}
  pageId={page.id}
  onCommentCreated={handleCommentCreated}
/>

<CommentPanel
  pageId={page.id}
  open={commentPanelOpen}
  {editor}
  {currentUserId}
  focusedCommentId={activeCommentId}
  onClose={() => (commentPanelOpen = false)}
/>
