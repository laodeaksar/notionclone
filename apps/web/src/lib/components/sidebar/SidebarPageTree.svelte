<script lang="ts">
  import { Plus, Search, X } from "lucide-svelte";
  import { setContext } from "svelte";
  import PageTreeItem from "$lib/components/PageTreeItem.svelte";
  import type { Workspace } from "$lib/stores/workspace.js";
  import type { PageTree } from "$lib/stores/page.js";
  import { Tooltip, InputGroup } from "@notion-clone/ui";
  import { reorderPageFn, pagesKey } from "$lib/queries.js";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";

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

  const qc = useQueryClient();

  // ── Filter ─────────────────────────────────────────────────────────────────
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
  const isFiltering = $derived(filterQuery.trim().length > 0);

  function countTree(nodes: PageTree[]): number {
    return nodes.reduce((acc, n) => acc + 1 + countTree(n.children), 0);
  }

  const totalCount = $derived(countTree(pagesTree));
  const visibleCount = $derived(countTree(visibleTree));

  // ── Drag & drop ────────────────────────────────────────────────────────────
  const reorderMutation = createMutation(() => ({
    mutationFn: reorderPageFn,
    onSuccess: async () => {
      if (currentWs) await qc.invalidateQueries({ queryKey: pagesKey(currentWs.id) });
    },
  }));

  const drag = $state({
    draggingId: null as string | null,
    dragOverId: null as string | null,
    dragPos: null as "above" | "below" | null,
  });

  function calcOrder(
    siblings: PageTree[],
    targetId: string,
    pos: "above" | "below"
  ): number {
    const sorted = [...siblings].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((n) => n.id === targetId);
    if (idx === -1) return 0;
    if (pos === "above") {
      const prev = sorted[idx - 1];
      return prev ? (prev.order + sorted[idx].order) / 2 : sorted[idx].order - 1;
    } else {
      const next = sorted[idx + 1];
      return next ? (sorted[idx].order + next.order) / 2 : sorted[idx].order + 1;
    }
  }

  setContext("page-drag", {
    get draggingId() { return drag.draggingId; },
    get dragOverId() { return drag.dragOverId; },
    get dragPos() { return drag.dragPos; },
    get isFiltering() { return isFiltering; },

    onDragStart(id: string) {
      drag.draggingId = id;
    },
    onDragOver(id: string, pos: "above" | "below") {
      drag.dragOverId = id;
      drag.dragPos = pos;
    },
    onDrop(opts: {
      targetId: string;
      pos: "above" | "below";
      siblings: PageTree[];
      parentId: string | null;
    }) {
      const { targetId, pos, siblings, parentId } = opts;
      if (!drag.draggingId || drag.draggingId === targetId) {
        drag.draggingId = null;
        drag.dragOverId = null;
        drag.dragPos = null;
        return;
      }
      const order = calcOrder(siblings, targetId, pos);
      reorderMutation.mutate({ id: drag.draggingId, parentId, order });
      drag.draggingId = null;
      drag.dragOverId = null;
      drag.dragPos = null;
    },
    onDragEnd() {
      drag.draggingId = null;
      drag.dragOverId = null;
      drag.dragPos = null;
    },
  });
</script>

<div class="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2">
  {#if currentWs}
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-1.5">
        <p class="text-xs text-muted-foreground font-medium">PAGES</p>
        {#if !pagesLoading && totalCount > 0}
          <span
            class="inline-flex items-center justify-center rounded-full px-1.5 py-px text-[10px] font-medium leading-none
                   {isFiltering
                     ? 'bg-primary/15 text-primary'
                     : 'bg-muted text-muted-foreground'}"
          >
            {isFiltering ? `${visibleCount}/${totalCount}` : totalCount}
          </span>
        {/if}
      </div>
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
        <PageTreeItem
          {node}
          depth={0}
          siblings={pagesTree}
          parentId={null}
          onCreateChild={onCreatePage}
        />
      {/each}
    {/if}
  {:else}
    <p class="text-xs text-muted-foreground px-1">Select a workspace to view pages</p>
  {/if}
</div>
