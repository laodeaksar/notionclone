<script lang="ts">
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import {
    versionsQueryOptions,
    versionsKey,
    restoreVersionFn,
    type PageVersion,
  } from "$lib/queries.js";

  let {
    pageId,
    open = $bindable(false),
    onRestore,
  }: {
    pageId: string;
    open: boolean;
    onRestore: (version: PageVersion) => void;
  } = $props();

  const qc = useQueryClient();

  // ── Versions query (only fetches when panel is open) ──────────────────────
  const versionsQuery = createQuery(() => versionsQueryOptions(pageId, open));
  const versions = $derived(versionsQuery.data ?? []);

  // ── Restore mutation ──────────────────────────────────────────────────────
  const restore = createMutation(() => ({
    mutationFn: restoreVersionFn,
    onSuccess: (restoredPage, { versionId }) => {
      // Find the version record to pass full context to parent
      const version = versions.find((v) => v.id === versionId);
      if (version) {
        onRestore({ ...version, ...restoredPage });
      }
      // Bust the versions list cache so next open shows fresh state
      qc.invalidateQueries({ queryKey: versionsKey(pageId) });
      open = false;
    },
  }));

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-40 flex"
    role="dialog"
    aria-modal="true"
    aria-label="Version history"
  >
    <!-- Backdrop -->
    <button
      class="absolute inset-0 bg-black/30"
      onclick={() => (open = false)}
      tabindex="-1"
      aria-label="Close"
    ></button>

    <!-- Panel -->
    <div class="relative ml-auto flex h-full w-80 flex-col border-l border-border bg-background shadow-xl">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 class="text-sm font-semibold">Version history</h2>
        <button
          onclick={() => (open = false)}
          class="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Close panel"
        >✕</button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-4">
        {#if versionsQuery.isPending}
          <div class="flex items-center justify-center py-12">
            <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        {:else if versionsQuery.isError}
          <p class="text-sm text-destructive">
            {versionsQuery.error?.message ?? "Failed to load history"}
          </p>
        {:else if versions.length === 0}
          <div class="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <span class="text-3xl">🕐</span>
            <p class="text-sm">No saved versions yet.</p>
            <p class="text-xs">Click "Save version" in the editor to create one.</p>
          </div>
        {:else}
          {#if restore.isError}
            <p class="mb-3 text-sm text-destructive">
              {restore.error?.message ?? "Restore failed"}
            </p>
          {/if}
          <ul class="space-y-2">
            {#each versions as v (v.id)}
              <li class="rounded-lg border border-border bg-card p-3 text-sm">
                <div class="mb-1 flex items-start justify-between gap-2">
                  <span class="font-medium leading-tight line-clamp-2">
                    {v.icon ? `${v.icon} ` : ""}{v.title}
                  </span>
                </div>
                <p class="text-xs text-muted-foreground">{formatDate(v.createdAt)}</p>
                <p class="text-xs text-muted-foreground">by {v.savedByUser.name}</p>
                <button
                  onclick={() => restore.mutate({ pageId, versionId: v.id })}
                  disabled={restore.isPending}
                  class="mt-2 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {restore.isPending && restore.variables?.versionId === v.id
                    ? "Restoring…"
                    : "Restore this version"}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}
