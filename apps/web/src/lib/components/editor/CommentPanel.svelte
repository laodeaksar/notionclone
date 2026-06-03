<script lang="ts">
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import type { Editor } from "@tiptap/core";
  import {
    commentsQueryOptions,
    commentsKey,
    createReplyFn,
    updateCommentFn,
    deleteCommentFn,
    type CommentThread,
  } from "$lib/queries.js";

  let {
    pageId,
    open,
    editor,
    currentUserId = "",
    focusedCommentId = null,
    onClose,
  }: {
    pageId: string;
    open: boolean;
    editor: Editor | null;
    currentUserId?: string;
    focusedCommentId?: string | null;
    onClose: () => void;
  } = $props();

  const queryClient = useQueryClient();
  const commentsQuery = createQuery(() => commentsQueryOptions(pageId, open));

  let activeTab = $state<"open" | "resolved">("open");
  let replyingTo = $state<string | null>(null);
  let replyText = $state("");
  let highlightedId = $state<string | null>(null);

  const threads = $derived(
    (commentsQuery.data ?? []).filter((c) =>
      activeTab === "open" ? !c.resolved : c.resolved
    )
  );
  const openCount = $derived((commentsQuery.data ?? []).filter((c) => !c.resolved).length);
  const resolvedCount = $derived((commentsQuery.data ?? []).filter((c) => c.resolved).length);

  $effect(() => {
    if (focusedCommentId) {
      highlightedId = focusedCommentId;
      scrollToComment(focusedCommentId);
      focusInEditor(focusedCommentId);
    }
  });

  function focusInEditor(commentId: string) {
    if (!editor) return;
    const doc = editor.state.doc;
    let found: { from: number; to: number } | null = null;
    doc.descendants((node, pos) => {
      for (const mark of node.marks) {
        if (mark.type.name === "comment" && mark.attrs.commentId === commentId) {
          if (!found) found = { from: pos, to: pos + node.nodeSize };
        }
      }
    });
    if (found) {
      editor.commands.setTextSelection(found);
      editor.commands.scrollIntoView();
    }
  }

  function scrollToComment(commentId: string) {
    const el = document.getElementById(`comment-${commentId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const resolveComment = createMutation(() => ({
    mutationFn: ({ id, resolved }: { id: string; resolved: boolean }) =>
      updateCommentFn({ id, resolved }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey(pageId) }),
  }));

  const deleteComment = createMutation(() => ({
    mutationFn: (id: string) => deleteCommentFn(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey(pageId) }),
  }));

  const addReply = createMutation(() => ({
    mutationFn: createReplyFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(pageId) });
      replyingTo = null;
      replyText = "";
    },
  }));

  function submitReply(commentId: string) {
    if (!replyText.trim()) return;
    addReply.mutate({ pageId, commentId, content: replyText.trim() });
  }

  function formatTime(ts: string | number | Date) {
    const d = new Date(ts);
    const diff = Date.now() - d.getTime();
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function initials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function avatarColor(name: string) {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-teal-100 text-teal-700",
    ];
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % colors.length;
    return colors[hash];
  }

  function handleThreadClick(thread: CommentThread) {
    highlightedId = thread.id;
    focusInEditor(thread.id);
  }
</script>

<div
  class="fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-40
         flex flex-col shadow-xl transition-transform duration-200 ease-out"
  class:translate-x-full={!open}
  class:translate-x-0={open}
  aria-hidden={!open}
  aria-label="Comments panel"
  role="complementary"
>
  <!-- Header -->
  <div class="flex items-center justify-between px-4 h-12 border-b border-border shrink-0">
    <h2 class="font-semibold text-sm">Comments</h2>
    <button
      onclick={onClose}
      class="w-7 h-7 flex items-center justify-center rounded-md
             hover:bg-accent text-muted-foreground transition-colors"
      aria-label="Close comments"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- Tabs -->
  <div class="flex border-b border-border shrink-0">
    {#each (["open", "resolved"] as const) as tab}
      <button
        onclick={() => (activeTab = tab)}
        class="flex-1 py-2.5 text-xs font-medium capitalize transition-colors border-b-2"
        class:border-foreground={activeTab === tab}
        class:text-foreground={activeTab === tab}
        class:border-transparent={activeTab !== tab}
        class:text-muted-foreground={activeTab !== tab}
      >
        {tab === "open" ? `Open (${openCount})` : `Resolved (${resolvedCount})`}
      </button>
    {/each}
  </div>

  <!-- Thread List -->
  <div class="flex-1 overflow-y-auto">
    {#if commentsQuery.isLoading}
      <div class="p-6 text-center text-xs text-muted-foreground">Loading…</div>
    {:else if threads.length === 0}
      <div class="p-8 text-center">
        <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
               class="text-muted-foreground">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p class="text-xs text-muted-foreground">
          {activeTab === "open"
            ? "No comments yet. Select text to add one."
            : "No resolved comments."}
        </p>
      </div>
    {:else}
      <div class="divide-y divide-border">
        {#each threads as thread (thread.id)}
          <div
            id="comment-{thread.id}"
            class="p-4 cursor-pointer transition-colors {highlightedId === thread.id ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}"
            onclick={() => handleThreadClick(thread)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Enter" && handleThreadClick(thread)}
          >
            <!-- Quote -->
            {#if thread.quote}
              <p class="text-xs text-muted-foreground italic border-l-2 border-yellow-400
                         pl-2 mb-3 line-clamp-2">
                "{thread.quote}"
              </p>
            {/if}

            <!-- Root comment -->
            <div class="flex gap-2.5">
              <div class="w-7 h-7 rounded-full {avatarColor(thread.author.name)}
                           flex items-center justify-center text-xs font-semibold shrink-0">
                {initials(thread.author.name)}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-baseline gap-1.5 mb-1">
                  <span class="text-xs font-semibold truncate">{thread.author.name}</span>
                  <span class="text-xs text-muted-foreground shrink-0">{formatTime(thread.createdAt)}</span>
                </div>
                <p class="text-xs leading-relaxed break-words text-foreground/90">{thread.content}</p>
              </div>
            </div>

            <!-- Actions row -->
            <div
              class="flex items-center gap-1 mt-2.5 ml-9"
              onclick={(e) => e.stopPropagation()}
              role="presentation"
            >
              <button
                onclick={() => {
                  replyingTo = replyingTo === thread.id ? null : thread.id;
                  replyText = "";
                }}
                class="text-xs text-muted-foreground hover:text-foreground transition-colors
                       px-2 py-1 rounded hover:bg-accent"
              >
                Reply
              </button>
              <button
                onclick={() =>
                  resolveComment.mutate({ id: thread.id, resolved: !thread.resolved })
                }
                class="text-xs text-muted-foreground hover:text-foreground transition-colors
                       px-2 py-1 rounded hover:bg-accent"
              >
                {thread.resolved ? "Re-open" : "Resolve"}
              </button>
              {#if thread.authorId === currentUserId}
                <button
                  onclick={() => deleteComment.mutate(thread.id)}
                  class="ml-auto text-xs text-muted-foreground hover:text-destructive
                         transition-colors px-2 py-1 rounded hover:bg-accent"
                >
                  Delete
                </button>
              {/if}
            </div>

            <!-- Replies -->
            {#if thread.replies && thread.replies.length > 0}
              <div class="mt-3 ml-9 space-y-3 border-l-2 border-border pl-3">
                {#each thread.replies as reply (reply.id)}
                  <div class="flex gap-2">
                    <div class="w-6 h-6 rounded-full {avatarColor(reply.author.name)}
                                 flex items-center justify-center text-xs font-semibold shrink-0">
                      {initials(reply.author.name)}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-baseline gap-1.5 mb-0.5">
                        <span class="text-xs font-semibold truncate">{reply.author.name}</span>
                        <span class="text-xs text-muted-foreground shrink-0">{formatTime(reply.createdAt)}</span>
                      </div>
                      <p class="text-xs leading-relaxed break-words">{reply.content}</p>
                    </div>
                    {#if reply.authorId === currentUserId}
                      <button
                        onclick={(e) => { e.stopPropagation(); deleteComment.mutate(reply.id); }}
                        class="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete reply"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Reply form -->
            {#if replyingTo === thread.id}
              <div
                class="mt-3 ml-9"
                onclick={(e) => e.stopPropagation()}
                role="presentation"
              >
                <textarea
                  bind:value={replyText}
                  placeholder="Reply…"
                  rows={2}
                  onkeydown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitReply(thread.id);
                    if (e.key === "Escape") { replyingTo = null; replyText = ""; }
                  }}
                  class="w-full text-xs resize-none bg-muted rounded-lg p-2
                         border border-border outline-none focus:ring-1 focus:ring-ring"
                ></textarea>
                <div class="flex justify-end gap-2 mt-1.5">
                  <button
                    onclick={() => { replyingTo = null; replyText = ""; }}
                    class="px-2 py-1 text-xs rounded hover:bg-accent text-muted-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onclick={() => submitReply(thread.id)}
                    disabled={!replyText.trim() || addReply.isPending}
                    class="px-2 py-1 text-xs rounded bg-foreground text-background disabled:opacity-50"
                  >
                    {addReply.isPending ? "…" : "Reply"}
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
