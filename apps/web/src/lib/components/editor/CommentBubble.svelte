<script lang="ts">
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import type { Editor } from "@tiptap/core";
  import { commentsKey, createCommentFn, type CommentThread } from "$lib/queries.js";

  let {
    editor,
    pageId,
    onCommentCreated,
  }: {
    editor: Editor | null;
    pageId: string;
    onCommentCreated?: (c: CommentThread) => void;
  } = $props();

  const queryClient = useQueryClient();

  let bubblePos = $state<{ left: number; top: number } | null>(null);
  let formOpen = $state(false);
  let commentText = $state("");
  let savedFrom = $state(0);
  let savedTo = $state(0);
  let savedQuote = $state("");
  let textareaEl = $state<HTMLTextAreaElement | null>(null);

  $effect(() => {
    if (!editor) return;

    const onSelection = () => {
      if (formOpen) return;
      const { from, to, empty } = editor.state.selection;
      if (empty) { bubblePos = null; return; }
      const text = editor.state.doc.textBetween(from, to, " ").trim();
      if (!text) { bubblePos = null; return; }
      try {
        const startCoords = editor.view.coordsAtPos(from);
        const endCoords = editor.view.coordsAtPos(to);
        const midX = (startCoords.left + endCoords.right) / 2;
        bubblePos = {
          left: Math.max(8, Math.min(midX - 52, window.innerWidth - 116)),
          top: Math.max(8, startCoords.top - 44),
        };
      } catch { bubblePos = null; }
    };

    editor.on("selectionUpdate", onSelection);
    editor.on("blur", () => { if (!formOpen) bubblePos = null; });

    return () => { editor.off("selectionUpdate", onSelection); };
  });

  $effect(() => {
    if (formOpen && textareaEl) {
      setTimeout(() => textareaEl?.focus(), 30);
    }
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
      bubblePos = null;
    },
  }));

  function openForm() {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    savedFrom = from;
    savedTo = to;
    savedQuote = editor.state.doc.textBetween(from, to, " ").slice(0, 300);
    formOpen = true;
    bubblePos = null;
  }

  function submit() {
    if (!commentText.trim()) return;
    createComment.mutate({ pageId, content: commentText.trim(), quote: savedQuote || undefined });
  }

  function cancel() {
    formOpen = false;
    commentText = "";
    bubblePos = null;
    savedQuote = "";
  }
</script>

{#if bubblePos && !formOpen}
  <button
    style="position:fixed;left:{bubblePos.left}px;top:{bubblePos.top}px;z-index:50;"
    onclick={openForm}
    class="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background
           text-xs font-medium rounded-full shadow-lg hover:opacity-90 transition-opacity
           select-none"
    aria-label="Add comment"
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    Comment
  </button>
{/if}

{#if formOpen}
  <div
    class="fixed inset-0 z-40"
    onclick={cancel}
    role="button"
    tabindex="-1"
    aria-label="Close"
    onkeydown={(e) => e.key === "Escape" && cancel()}
  ></div>

  <div
    class="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-72
           bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
    role="dialog"
    aria-label="New comment"
  >
    {#if savedQuote}
      <div class="px-4 pt-3 pb-0">
        <p class="text-xs text-muted-foreground italic border-l-2 border-yellow-400 pl-2 line-clamp-2">
          "{savedQuote}"
        </p>
      </div>
    {/if}

    <div class="p-4">
      <textarea
        bind:this={textareaEl}
        bind:value={commentText}
        placeholder="Add a comment…"
        rows={3}
        onkeydown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          if (e.key === "Escape") cancel();
        }}
        class="w-full text-sm resize-none bg-transparent outline-none
               placeholder:text-muted-foreground leading-relaxed"
      ></textarea>
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
          class="px-3 py-1.5 text-xs rounded-lg bg-foreground text-background
                 font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {createComment.isPending ? "Saving…" : "Comment"}
        </button>
      </div>
    </div>
  </div>
{/if}
