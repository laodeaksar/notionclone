<script lang="ts">
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import type { Editor } from "@tiptap/core";
  import { commentsKey, createCommentFn, type CommentThread } from "$lib/queries.js";
  import { MessageSquare, Loader2 } from "lucide-svelte";
  import MentionInput from "./MentionInput.svelte";

  let {
    editor,
    pageId,
    workspaceId,
    onCommentCreated,
  }: {
    editor: Editor | null;
    pageId: string;
    workspaceId: string;
    onCommentCreated?: (c: CommentThread) => void;
  } = $props();

  const queryClient = useQueryClient();

  let bubblePos = $state<{ left: number; top: number } | null>(null);
  let formOpen = $state(false);
  let commentText = $state("");
  let savedFrom = $state(0);
  let savedTo = $state(0);
  let savedQuote = $state("");

  // Track whether the pointer is held down on the comment button so blur
  // doesn't clear the bubble before the click registers.
  let pointerOnButton = false;

  $effect(() => {
    // Use the native selectionchange event — it fires reliably regardless of
    // how the editor emits its own events, and doesn't depend on timing with
    // the editor initialization.
    function checkSelection() {
      if (formOpen) return;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        bubblePos = null;
        return;
      }

      const text = sel.toString().trim();
      if (!text) { bubblePos = null; return; }

      // Only show bubble when the selection is inside the editor.
      if (!editor) { bubblePos = null; return; }
      const editorDom = editor.view.dom;
      const range = sel.getRangeAt(0);
      if (!editorDom.contains(range.commonAncestorContainer)) {
        bubblePos = null;
        return;
      }

      try {
        const rect = range.getBoundingClientRect();
        if (!rect.width && !rect.height) { bubblePos = null; return; }
        const midX = (rect.left + rect.right) / 2;
        bubblePos = {
          left: Math.max(8, Math.min(midX - 52, window.innerWidth - 116)),
          top: Math.max(8, rect.top - 44),
        };
      } catch { bubblePos = null; }
    }

    // When the editor loses focus clear the bubble — but only if the pointer
    // isn't currently held down on the comment button itself.
    function handleBlur() {
      if (!formOpen && !pointerOnButton) bubblePos = null;
    }

    document.addEventListener("selectionchange", checkSelection);
    if (editor) editor.on("blur", handleBlur);

    return () => {
      document.removeEventListener("selectionchange", checkSelection);
      if (editor) editor.off("blur", handleBlur);
    };
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
    onpointerdown={() => { pointerOnButton = true; }}
    onpointerup={() => { pointerOnButton = false; openForm(); }}
    onpointercancel={() => { pointerOnButton = false; }}
    class="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background
           text-xs font-medium rounded-full shadow-lg hover:opacity-90 transition-opacity
           select-none"
    aria-label="Add comment"
  >
    <MessageSquare class="w-3 h-3" strokeWidth={2.5} />
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
