<script lang="ts">
  import { Plus, Search, X } from "lucide-svelte";
  import PageTreeItem from "$lib/components/PageTreeItem.svelte";
  import type { Workspace } from "$lib/stores/workspace.js";
  import type { PageTree } from "$lib/stores/page.js";
  import { Tooltip, InputGroup } from "@notion-clone/ui";

  let {
    currentWs,
    pagesTree,
    pagesLoading,
    createIsPending,
    onCreatePage,
  }: {
    currentWs: Workspace | null;
    pagesTree: PageTree[];
    pagesLoading: boolean;
    createIsPending: boolean;
    onCreatePage: (parentId?: string) => void;
  } = $props();

  let filterQuery = $state("");

  function filterTree(nodes: PageTree[], query: string): PageTree[] {
    if (!query.trim()) return nodes;
    const q = query.toLowerCase();
    return nodes.reduce<PageTree[]>((acc, node) => {
      const filteredChildren = filterTree(node.children, q);
      if ((node.title ?? "").toLowerCase().includes(q) || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
      return acc;
    }, []);
  }

  const visibleTree = $derived(filterTree(pagesTree, filterQuery));
</script>

<div class="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2">
  {#if currentWs}
    <div class="flex items-center justify-between px-1">
      <p class="text-xs text-muted-foreground font-medium">PAGES</p>
      <Tooltip.Root content="New page" shortcut="⌘N" side="right">
        <button
          onclick={() => onCreatePage()}
          disabled={createIsPending}
          class="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          aria-label="New page"
        >
          <Plus class="w-3.5 h-3.5" />
        </button>
      </Tooltip.Root>
    </div>

    <!-- Search / filter -->
    <InputGroup.Root
      placeholder="Filter pages…"
      bind:value={filterQuery}
      class="h-7 text-xs"
      wrapperClass="px-1"
    >
      {#snippet leftSection()}
        <Search class="w-3 h-3" />
      {/snippet}
      {#snippet rightSection()}
        {#if filterQuery}
          <button
            onclick={() => (filterQuery = "")}
            class="flex items-center justify-center hover:text-foreground transition-colors"
            aria-label="Clear filter"
          >
            <X class="w-3 h-3" />
          </button>
        {/if}
      {/snippet}
    </InputGroup.Root>

    {#if pagesLoading}
      <p class="text-xs text-muted-foreground px-1">Loading…</p>
    {:else if pagesTree.length === 0}
      <p class="text-xs text-muted-foreground px-1">No pages yet</p>
    {:else if visibleTree.length === 0}
      <p class="text-xs text-muted-foreground px-1 italic">No pages match "{filterQuery}"</p>
    {:else}
      {#each visibleTree as node (node.id)}
        <PageTreeItem {node} depth={0} onCreateChild={onCreatePage} />
      {/each}
    {/if}
  {:else}
    <p class="text-xs text-muted-foreground px-1">Select a workspace to view pages</p>
  {/if}
</div>
