<script lang="ts">
  import { Plus } from "lucide-svelte";
  import PageTreeItem from "$lib/components/PageTreeItem.svelte";
  import type { Workspace } from "$lib/stores/workspace.js";
  import type { PageTree } from "$lib/stores/page.js";
  import { Tooltip } from "@notion-clone/ui";

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
</script>

<div class="flex-1 overflow-y-auto px-2 py-2">
  {#if currentWs}
    <div class="flex items-center justify-between px-1 mb-1">
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

    {#if pagesLoading}
      <p class="text-xs text-muted-foreground px-1">Loading…</p>
    {:else if pagesTree.length === 0}
      <p class="text-xs text-muted-foreground px-1">No pages yet</p>
    {:else}
      {#each pagesTree as node (node.id)}
        <PageTreeItem {node} depth={0} onCreateChild={onCreatePage} />
      {/each}
    {/if}
  {:else}
    <p class="text-xs text-muted-foreground px-1">Select a workspace to view pages</p>
  {/if}
</div>
