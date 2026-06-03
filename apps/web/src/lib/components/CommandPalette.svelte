<script lang="ts">
  import { goto } from "$app/navigation";
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { currentWorkspaceId } from "$lib/stores/workspace.js";
  import { pagesQueryOptions, pagesKey, createPageFn } from "$lib/queries.js";
  import { Search, File, FilePlus, ArrowUp, ArrowDown, CornerDownLeft, Loader2 } from "lucide-svelte";

  let { open = $bindable(false) }: { open: boolean } = $props();

  let query = $state("");
  let selectedIndex = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);

  const qc = useQueryClient();

  const pagesQuery = createQuery(() =>
    pagesQueryOptions($currentWorkspaceId ?? "")
  );

  const createPage = createMutation(() => ({
    mutationFn: createPageFn,
    onSuccess: async (page) => {
      if ($currentWorkspaceId) {
        await qc.invalidateQueries({ queryKey: pagesKey($currentWorkspaceId) });
      }
      goto(`/app/${page.id}`);
      close();
    },
  }));

  const filtered = $derived(() => {
    const pages = pagesQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return pages.slice(0, 8);
    return pages
      .filter((p) => (p.title || "Untitled").toLowerCase().includes(q))
      .slice(0, 8);
  });

  // Show create option whenever there's a non-empty query
  const showCreate = $derived(query.trim().length > 0);
  // Total navigable items = search results + optional create row
  const totalItems = $derived(filtered().length + (showCreate ? 1 : 0));
  // The create option always lives at the last index
  const createIndex = $derived(filtered().length);

  $effect(() => {
    if (open) {
      query = "";
      selectedIndex = 0;
      setTimeout(() => inputEl?.focus(), 10);
    }
  });

  $effect(() => {
    query;
    selectedIndex = 0;
  });

  function close() {
    open = false;
    query = "";
  }

  function navigate(pageId: string) {
    goto(`/app/${pageId}`);
    close();
  }

  function handleCreate() {
    if (!$currentWorkspaceId || createPage.isPending) return;
    createPage.mutate({
      title: query.trim(),
      workspaceId: $currentWorkspaceId,
    });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, totalItems - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showCreate && selectedIndex === createIndex) {
        handleCreate();
      } else {
        const page = filtered()[selectedIndex];
        if (page) navigate(page.id);
      }
    } else if (e.key === "Escape") {
      close();
    }
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    onclick={close}
    role="button"
    tabindex="-1"
    aria-label="Close command palette"
    onkeydown={(e) => e.key === "Escape" && close()}
  ></div>

  <!-- Palette -->
  <div
    class="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-lg
           bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
    role="dialog"
    aria-label="Command palette"
  >
    <!-- Search input -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
      <Search class="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        bind:this={inputEl}
        bind:value={query}
        onkeydown={handleKeydown}
        type="text"
        placeholder="Search or create a page…"
        class="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        aria-label="Search pages"
      />
      <kbd class="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono">ESC</kbd>
    </div>

    <!-- Results -->
    <div class="max-h-80 overflow-y-auto py-1">
      {#if pagesQuery.isPending}
        <p class="px-4 py-3 text-xs text-muted-foreground">Loading…</p>
      {:else}
        {#if filtered().length === 0 && !showCreate}
          <p class="px-4 py-6 text-center text-sm text-muted-foreground">No pages found</p>
        {/if}

        {#each filtered() as page, i (page.id)}
          <button
            onclick={() => navigate(page.id)}
            onmouseenter={() => (selectedIndex = i)}
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                   {selectedIndex === i ? 'bg-accent text-foreground' : 'text-foreground/80 hover:bg-accent/50'}"
          >
            <File class="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            <span class="flex-1 truncate">{page.title || "Untitled"}</span>
            {#if selectedIndex === i}
              <CornerDownLeft class="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            {/if}
          </button>
        {/each}

        {#if showCreate}
          {#if filtered().length > 0}
            <div class="mx-4 my-1 border-t border-border"></div>
          {/if}
          <button
            onclick={handleCreate}
            onmouseenter={() => (selectedIndex = createIndex)}
            disabled={createPage.isPending}
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors disabled:opacity-60
                   {selectedIndex === createIndex ? 'bg-accent text-foreground' : 'text-foreground/80 hover:bg-accent/50'}"
          >
            {#if createPage.isPending}
              <Loader2 class="w-4 h-4 shrink-0 text-muted-foreground animate-spin" />
            {:else}
              <FilePlus class="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            {/if}
            <span class="flex-1 truncate">
              Create page: <span class="font-medium">"{query.trim()}"</span>
            </span>
            {#if selectedIndex === createIndex}
              <CornerDownLeft class="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            {/if}
          </button>
        {/if}
      {/if}
    </div>

    <!-- Footer hint -->
    <div class="flex items-center gap-3 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
      <span class="flex items-center gap-1"><ArrowUp class="w-3 h-3" /><ArrowDown class="w-3 h-3" /> navigate</span>
      <span class="flex items-center gap-1"><CornerDownLeft class="w-3 h-3" /> open</span>
      <span>ESC close</span>
    </div>
  </div>
{/if}
