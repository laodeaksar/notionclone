<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { PageTree } from "$lib/stores/page.js";
  import { deletePageFn, pagesKey } from "$lib/queries.js";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import PageTreeItem from "./PageTreeItem.svelte";

  let {
    node,
    depth,
    onCreateChild,
  }: {
    node: PageTree;
    depth: number;
    onCreateChild: (parentId: string) => void;
  } = $props();

  const qc = useQueryClient();

  const deletePageMutation = createMutation(() => ({
    mutationFn: deletePageFn,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: pagesKey(node.workspaceId) });
      if (isActive) goto("/app");
    },
  }));

  let expanded = $state(true);
  let currentPath = $derived($page.url.pathname);
  let isActive = $derived(currentPath === `/app/${node.id}`);

  function deletePage() {
    deletePageMutation.mutate(node.id);
  }
</script>

<div>
  <div
    class="group flex items-center gap-1 px-1 py-0.5 rounded text-sm hover:bg-accent transition-colors cursor-pointer"
    class:bg-accent={isActive}
    style="padding-left: {depth * 12 + 4}px"
  >
    <!-- expand toggle -->
    <button
      onclick={() => (expanded = !expanded)}
      class="w-4 h-4 text-muted-foreground flex-shrink-0 text-xs"
    >
      {#if node.children.length > 0}
        {expanded ? "▾" : "▸"}
      {:else}
        &nbsp;
      {/if}
    </button>

    <!-- icon -->
    <span class="text-base leading-none">{node.icon ?? "📄"}</span>

    <!-- title -->
    <button
      onclick={() => goto(`/app/${node.id}`)}
      class="flex-1 text-left truncate"
    >
      {node.title || "Untitled"}
    </button>

    <!-- actions (show on hover) -->
    <div class="hidden group-hover:flex items-center gap-0.5">
      <button
        onclick={() => onCreateChild(node.id)}
        class="w-4 h-4 text-xs text-muted-foreground hover:text-foreground"
        title="Add sub-page"
      >+</button>
      <button
        onclick={deletePage}
        class="w-4 h-4 text-xs text-muted-foreground hover:text-destructive"
        title="Delete"
      >×</button>
    </div>
  </div>

  {#if expanded && node.children.length > 0}
    {#each node.children as child (child.id)}
      <PageTreeItem node={child} depth={depth + 1} {onCreateChild} />
    {/each}
  {/if}
</div>
