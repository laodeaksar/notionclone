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
  import { saveDraft, loadDraft, clearDraft } from "$lib/draft.js";
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

  // ── Draft state ────────────────────────────────────────────────────────────
  // `hasDraft` = true when IDB has unsynchronised content for this page.
  // `pendingDraft` holds content loaded from IDB waiting to be applied to editor.
  let hasDraft = $state(false);
  let pendingDraft = $state<string | null>(null);

  // Load draft from IDB whenever page changes.
  // Guards:
  // - Stale async race: checks page.id still matches when promise resolves.
  // - Recency: only restores draft if it is newer than the server's last save.
  $effect(() => {
    const pageId = page.id;
    const serverUpdatedAt = new Date(page.updatedAt).getTime();
    untrack(() => {
      hasDraft = false;
      pendingDraft = null;
    });
    loadDraft(pageId).then((draft) => {
      // Ignore result if page changed while IDB was loading.
      if (page.id !== pageId) return;
      if (draft) {
        if (draft.savedAt > serverUpdatedAt) {
          // Local draft is newer than server — restore it.
          pendingDraft = draft.content;
          hasDraft = true;
        } else {
          // Server is newer (e.g. synced from another device) — discard stale draft.
          clearDraft(pageId).catch(() => {});
        }
      }
    });
  });

  // Apply draft to editor as soon as both are ready.
  // Calling setContent() also triggers onUpdate → scheduleContentSave so the
  // draft is re-queued as a fresh mutation when back online.
  $effect(() => {
    const ed = editor;
    const draft = pendingDraft;
    if (ed && draft !== null) {
      untrack(() => {
        try {
          ed.commands.setContent(JSON.parse(draft));
        } catch {}
        pendingDraft = null;
      });
    }
  });

  // ── Comments count for badge ───────────────────────────────────────────────
  const commentsQuery = createQuery(() =>
    commentsQueryOptions(page.id, commentPanelOpen)
  );
  let openCommentCount = $derived(
    (commentsQuery.data ?? []).filter((c) => !c.resolved).length
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const saveContent = createMutation(() => ({
    mutationFn: updatePageFn,
    onSuccess: (_data: Page, variables: { id: string; content?: string | null }) => {
      // Draft is now persisted on the server — remove local copy.
      clearDraft(variables.id).catch(() => {});
      hasDraft = false;
    },
    onError: (_error: unknown, variables: { id: string; content?: string | null }) => {
      // Server returned a real error (4xx/5xx) — not an offline pause.
      // Offline mutations are PAUSED by networkMode:"offlineFirst", never errored.
      // So onError always means a server/business-logic failure; clear the draft
      // to avoid retrying bad content on next load.
      clearDraft(variables.id).catch(() => {});
      hasDraft = false;
    },
  }));
  const saveVersion = createMutation(() => ({ mutationFn: saveVersionFn }));

  // ── Title ──────────────────────────────────────────────────────────────────
  function handleTitleInput(val: string) {
    titleValue = val;
    clearTimeout(titleTimer);
    titleTimer = setTimeout(() => onTitleChange?.(val), 400);
  }

  // ── Content auto-save (debounced 1 s) ─────────────────────────────────────
  // Draft is written to IDB immediately (works offline); the server mutation
  // fires after the debounce window and is paused automatically when offline.
  function scheduleContentSave(json: string) {
    // Persist to IDB right away — survives browser close while offline.
    saveDraft(page.id, json).catch(() => {});
    hasDraft = true;

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveContent.mutate({ id: page.id, content: json });
    }, 1000);
  }

  // ── Discard draft ──────────────────────────────────────────────────────────
  // Remove the local draft and restore the last content saved on the server.
  async function discardDraft() {
    await clearDraft(page.id).catch(() => {});
    hasDraft = false;
    if (editor) {
      try {
        const serverContent = page.content ? JSON.parse(page.content) : null;
        editor.commands.setContent(serverContent ?? { type: "doc", content: [{ type: "paragraph" }] });
      } catch {
        editor.commands.setContent({ type: "doc", content: [{ type: "paragraph" }] });
      }
    }
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
    {hasDraft}
    onImageUpload={handleImageUpload}
    onSaveVersion={handleSaveVersion}
    onOpenHistory={() => (historyOpen = true)}
    onToggleComments={() => (commentPanelOpen = !commentPanelOpen)}
    onDiscardDraft={discardDraft}
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
