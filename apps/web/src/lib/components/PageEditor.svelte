<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { uploadImage, slashMenuStore, type ImageFileResult } from "$lib/editor.js";
  import {
    updatePageFn,
    saveVersionFn,
    commentsQueryOptions,
    type PageVersion,
    type CommentThread,
  } from "$lib/queries.js";
  import { useSession } from "$lib/auth-client.js";
  import { saveDraft, loadDraft, clearDraft } from "$lib/draft.js";
  import { isOnline } from "$lib/stores/network.js";
  import type { Editor } from "@tiptap/core";
  import type { Page } from "$lib/stores/page.js";

  import PageHeader from "./editor/PageHeader.svelte";
  import EditorToolbar from "./editor/EditorToolbar.svelte";
  import EditorArea from "./editor/EditorArea.svelte";
  import ImageBubbleMenu from "./editor/ImageBubbleMenu.svelte";
  import ImageResizeHandles from "./editor/ImageResizeHandles.svelte";
  import BlockContextMenu from "./editor/BlockContextMenu.svelte";
  import SlashMenu from "./editor/SlashMenu.svelte";
  import FloatingToolbar from "./editor/FloatingToolbar.svelte";
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
  let imageRect = $state<{ left: number; top: number; width: number; height: number } | null>(null);

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
  let hasDraft = $state(false);
  let pendingDraft = $state<string | null>(null);
  let draftSavedAt = 0;
  let suppressAutoSave = false;

  $effect(() => {
    const pageId = page.id;
    const serverUpdatedAt = new Date(page.updatedAt).getTime();
    untrack(() => {
      hasDraft = false;
      pendingDraft = null;
    });
    loadDraft(pageId).then((draft) => {
      if (page.id !== pageId) return;
      if (draft) {
        if (draft.savedAt > serverUpdatedAt) {
          pendingDraft = draft.content;
          hasDraft = true;
        } else {
          clearDraft(pageId).catch(() => {});
        }
      }
    });
  });

  // Apply draft and scan for pending images once editor + draft are both ready.
  $effect(() => {
    const ed = editor;
    const draft = pendingDraft;
    if (ed && draft !== null) {
      untrack(() => {
        try {
          ed.commands.setContent(JSON.parse(draft));
          // Count any images that were queued offline (embedded as base64 with pendingId).
          pendingImageCount = countPendingImages(ed);
        } catch {}
        pendingDraft = null;
      });
    }
  });

  // ── Offline image upload queue ─────────────────────────────────────────────
  // Strategy: when offline, convert File → base64 data URL and insert as an image
  // node tagged with a unique `pendingId`. The base64 is stored inside the draft
  // JSON in IDB, so it survives browser close. On reconnect, all pending images
  // are uploaded to Cloudinary and their nodes updated with the permanent URL.

  let pendingImageCount = $state(0);
  let isProcessingImages = false;

  /** Count image nodes in the editor that are awaiting upload (non-error pendingId). */
  function countPendingImages(ed: Editor): number {
    let n = 0;
    ed.state.doc.descendants((node) => {
      if (
        node.type.name === "image" &&
        node.attrs.pendingId &&
        !String(node.attrs.pendingId).startsWith("error:")
      ) {
        n++;
      }
    });
    return n;
  }

  /** Convert a File to a base64 data URL (works offline, survives IDB serialisation). */
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /** Convert a base64 data URL back to a File for re-uploading. */
  function dataUrlToFile(dataUrl: string, filename: string): File {
    const [header, data] = dataUrl.split(",");
    const mimeType = header?.match(/:(.*?);/)?.[1] ?? "image/png";
    const ext = mimeType.split("/")[1] ?? "png";
    const binary = atob(data ?? "");
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], `${filename}.${ext}`, { type: mimeType });
  }

  /**
   * Called by EditorArea (toolbar button, drag-drop, paste) for every image file.
   * - Online: uploads immediately to Cloudinary, returns permanent URL.
   * - Offline: embeds as base64 with a pendingId; upload is deferred to reconnect.
   */
  async function handleImageFile(file: File): Promise<ImageFileResult> {
    if (navigator.onLine) {
      const src = await uploadImage(file);
      return { src };
    }
    const id = crypto.randomUUID();
    const src = await fileToDataUrl(file);
    pendingImageCount++;
    return { src, pendingId: id };
  }

  /**
   * Scan the editor for pending-image nodes, upload each to Cloudinary, and
   * replace the base64 placeholder with the permanent URL.
   * Stops early if the device goes offline mid-processing.
   */
  async function processImageQueue() {
    if (isProcessingImages || !editor) return;
    isProcessingImages = true;
    try {
      // Snapshot all pending nodes (pos can shift as we dispatch, so find by id each time).
      const pending: { id: string; src: string }[] = [];
      editor.state.doc.descendants((node) => {
        if (
          node.type.name === "image" &&
          node.attrs.pendingId &&
          !String(node.attrs.pendingId).startsWith("error:")
        ) {
          pending.push({ id: node.attrs.pendingId as string, src: node.attrs.src as string });
        }
      });

      for (const { id, src } of pending) {
        if (!navigator.onLine) break; // went offline mid-flight — stop and wait for next reconnect

        try {
          const file = dataUrlToFile(src, `pending-${id}`);
          const url = await uploadImage(file);

          // Re-locate the node by pendingId (position may have changed).
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === "image" && node.attrs.pendingId === id) {
              editor!.view.dispatch(
                editor!.state.tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  src: url,
                  pendingId: null,
                })
              );
              return false;
            }
          });

          pendingImageCount = Math.max(0, pendingImageCount - 1);
        } catch {
          if (!navigator.onLine) break; // transient offline — will retry on reconnect

          // Permanent server/Cloudinary error: mark node so user knows.
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === "image" && node.attrs.pendingId === id) {
              editor!.view.dispatch(
                editor!.state.tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  pendingId: `error:${id}`,
                })
              );
              return false;
            }
          });
          pendingImageCount = Math.max(0, pendingImageCount - 1);
        }
      }
    } finally {
      isProcessingImages = false;
    }
  }

  // Trigger image queue processing when we come back online or editor becomes ready.
  $effect(() => {
    const online = $isOnline;
    const ed = editor;
    const count = pendingImageCount;
    if (online && ed && count > 0) {
      processImageQueue();
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
    if (suppressAutoSave) return;

    draftSavedAt = Date.now();
    saveDraft(page.id, json).catch(() => {});
    hasDraft = true;

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const capturedSavedAt = draftSavedAt;
      const capturedPageId = page.id;
      saveContent.mutate({ id: capturedPageId, content: json }, {
        onSuccess: () => {
          if (draftSavedAt <= capturedSavedAt) {
            clearDraft(capturedPageId).catch(() => {});
            hasDraft = false;
          }
        },
        onError: () => {
          if (draftSavedAt <= capturedSavedAt) {
            clearDraft(capturedPageId).catch(() => {});
            hasDraft = false;
          }
        },
      });
    }, 1000);
  }

  // ── Discard draft ──────────────────────────────────────────────────────────
  function discardDraft() {
    clearDraft(page.id).catch(() => {});
    hasDraft = false;
    draftSavedAt = 0;
    clearTimeout(saveTimer);
    if (editor) {
      suppressAutoSave = true;
      try {
        const serverContent = page.content ? JSON.parse(page.content) : null;
        editor.commands.setContent(serverContent ?? { type: "doc", content: [{ type: "paragraph" }] });
      } catch {
        editor.commands.setContent({ type: "doc", content: [{ type: "paragraph" }] });
      }
      suppressAutoSave = false;
    }
  }

  // ── Image upload (toolbar button) ─────────────────────────────────────────
  function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/gif,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      try {
        const result = await handleImageFile(file);
        editor!.chain().focus().setImage({
          src: result.src,
          align: "center",
          ...(result.pendingId ? { pendingId: result.pendingId } : {}),
        }).run();
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

  function deleteImage() {
    editor?.chain().focus().deleteSelection().run();
    imageSelected = false;
    imageBubble = null;
    imageRect = null;
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
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "M") {
      e.preventDefault();
      commentPanelOpen = !commentPanelOpen;
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
    {pendingImageCount}
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
    bind:imageRect
    onOpenContextMenu={openContextMenu}
    onCommentClick={handleCommentClick}
    onImageFile={handleImageFile}
  />
</div>

<ImageBubbleMenu
  visible={imageSelected}
  position={imageBubble}
  onAlign={setImageAlign}
  onDelete={deleteImage}
/>

<ImageResizeHandles
  visible={imageSelected}
  {imageRect}
  {editor}
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
<FloatingToolbar {editor} />

<VersionHistory
  pageId={page.id}
  bind:open={historyOpen}
  onRestore={handleRestore}
/>

<CommentBubble
  {editor}
  pageId={page.id}
  workspaceId={page.workspaceId}
  onCommentCreated={handleCommentCreated}
/>

<CommentPanel
  pageId={page.id}
  workspaceId={page.workspaceId}
  open={commentPanelOpen}
  {editor}
  {currentUserId}
  focusedCommentId={activeCommentId}
  onClose={() => (commentPanelOpen = false)}
/>
