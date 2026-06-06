<script lang="ts">
  import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import type { Editor } from "@tiptap/core";
  import { commentsKey, createCommentFn, type CommentThread } from "$lib/queries.js";
  import { Loader2 } from "lucide-svelte";
  import MentionInput from "./MentionInput.svelte";

  let {
    editor,
    pageId,
    workspaceId,
    onCommentCreated,
    openForm: openFormBind = $bindable(undefined),
  }: {
    editor: Editor | null;
    pageId: string;
    workspaceId: string;
    onCommentCreated?: (c: CommentThread) => void;
    openForm?: (() => void) | undefined;
  } = $props();

  const queryClient = useQueryClient();

  let formOpen = $state(false);
  let commentText = $state("");
  let savedFrom = $state(0);
  let savedTo = $state(0);
  let savedQuote = $state("");

  // Snapshot of the selection rect captured when the form is opened.
  // Stored as a frozen DOMRect so the form stays anchored even after selection clears.
  let anchorRect = $state<DOMRect | null>(null);

  let dialogEl = $state<HTMLDivElement | undefined>();
  let posX = $state(0);
  let posY = $state(0);

  // ── Floating-ui positioning ────────────────────────────────────────────────

  $effect(() => {
    if (!formOpen || !anchorRect || !dialogEl) return;

    const frozen = anchorRect;
    const editorDom = editor?.view.dom;

    const virtualRef = {
      getBoundingClientRect: () => frozen,
      ...(editorDom ? { contextElement: editorDom } : {}),
    };

    const el = dialogEl;

    async function update() {
      if (!el) return;
      const { x, y } = await computePosition(virtualRef, el, {
        placement: "right-start",
        middleware: [
          offset({ mainAxis: 16, crossAxis: -4 }),
          flip({
            padding: 8,
            fallbackPlacements: ["left-start", "bottom", "top"],
          }),
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

  // ── Form actions ──────────────────────────────────────────────────────────

  function openForm() {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    savedFrom = from;
    savedTo = to;
    savedQuote = editor.state.doc.textBetween(from, to, " ").slice(0, 300);

    // Snapshot the selection rect at open time so we have a stable anchor.
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      anchorRect = sel.getRangeAt(0).getBoundingClientRect();
    } else {
      // Fallback: use the editor view's caret coords.
      try {
        const coords = editor.view.coordsAtPos(from);
        anchorRect = new DOMRect(coords.left, coords.top, 0, coords.bottom - coords.top);
      } catch {
        anchorRect = null;
      }
    }

    formOpen = true;
  }

  // Expose openForm to parent via bindable prop.
  $effect(() => {
    openFormBind = openForm;
  });

  const createComment = createMutation(() => ({
    mutationFn: createCommentFn,
    onSuccess: (data) => {
      if (editor && savedFrom !== savedTo) {
        editor
          .chain()
          .setTextSelection({ from: savedFrom, to: savedTo })
          .setMark("comment", { commentId: data!.id })
          .run();
      }
      queryClient.invalidateQueries({ queryKey: commentsKey(pageId) });
      onCommentCreated?.(data!);
      commentText = "";
      formOpen = false;
      anchorRect = null;
      savedQuote = "";
    },
  }));

  function submit() {
    if (!commentText.trim()) return;
    createComment.mutate({ pageId, content: commentText.trim(), quote: savedQuote || undefined });
  }

  function cancel() {
    formOpen = false;
    commentText = "";
    anchorRect = null;
    savedQuote = "";
  }
</script>

{#if formOpen}
  <!-- Backdrop — closes form on outside click -->
  <div
    class="fixed inset-0 z-40"
    onclick={cancel}
    role="button"
    tabindex="-1"
    aria-label="Close"
    onkeydown={(e) => e.key === "Escape" && cancel()}
  ></div>

  <!-- Comment form — floats near the selected text -->
  <div
    bind:this={dialogEl}
    class="fixed z-50 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
    role="dialog"
    aria-label="New comment"
    aria-modal="true"
  >
    {#if savedQuote}
      <div class="px-4 pt-3 pb-0">
        <p class="text-xs text-muted-foreground italic border-l-2 border-yellow-400 pl-2 line-clamp-2">
          "{savedQuote}"
        </p>
      </div>
    {/if}

    <div class="p-4">
      <MentionInput
        bind:value={commentText}
        {workspaceId}
        placeholder="Add a comment… (type @ to mention)"
        rows={3}
        autofocus
        textareaClass="w-full text-sm resize-none bg-transparent outline-none
                       placeholder:text-muted-foreground leading-relaxed"
        onSubmit={submit}
        onEscape={cancel}
      />
      <div class="flex justify-end gap-2 mt-2 pt-2 border-t border-border">
        <button
          onclick={cancel}
          class="px-3 py-1.5 text-xs rounded-lg hover:bg-accent
                 text-muted-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={submit}
          disabled={!commentText.trim() || createComment.isPending}
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-foreground
                 text-background font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {#if createComment.isPending}
            <Loader2 class="w-3 h-3 animate-spin" />
            Saving…
          {:else}
            Comment
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
