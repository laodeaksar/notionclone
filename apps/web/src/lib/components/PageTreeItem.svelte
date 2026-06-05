<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { PageTree } from "$lib/stores/page.js";
  import { deletePageFn, updatePageFn, pagesKey } from "$lib/queries.js";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { ChevronRight, ChevronDown, File, Plus, MoreHorizontal } from "lucide-svelte";
  import { ContextMenu, Tooltip } from "@notion-clone/ui";
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

  // ── Mutations ─────────────────────────────────────────────────────────────
  const deletePageMutation = createMutation(() => ({
    mutationFn: deletePageFn,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: pagesKey(node.workspaceId) });
      if (isActive) goto("/app");
    },
  }));

  const updatePageMutation = createMutation(() => ({
    mutationFn: updatePageFn,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: pagesKey(node.workspaceId) });
    },
  }));

  // ── State ─────────────────────────────────────────────────────────────────
  let expanded = $state(true);
  let renaming = $state(false);
  let renameValue = $state("");
  let renameInputEl = $state<HTMLInputElement | null>(null);

  let currentPath = $derived($page.url.pathname);
  let isActive = $derived(currentPath === `/app/${node.id}`);

  $effect(() => {
    if (renaming && renameInputEl) {
      renameInputEl.focus();
      renameInputEl.select();
    }
  });

  // ── Context menu items (defined in script — string icon names) ─────────────
  const menuItems = $derived([
    {
      label: "Rename",
      icon: "pencil",
      onclick: () => {
        renameValue = node.title ?? "";
        renaming = true;
      },
    },
    {
      label: "Add sub-page",
      icon: "file-plus",
      onclick: () => onCreateChild(node.id),
    },
    {
      label: "Copy link",
      icon: "link",
      separator: true,
      onclick: () => {
        const url = `${window.location.origin}/app/${node.id}`;
        navigator.clipboard.writeText(url).catch(() => {});
      },
    },
    {
      label: "Delete",
      icon: "trash",
      variant: "destructive" as const,
      separator: true,
      onclick: () => deletePageMutation.mutate(node.id),
    },
  ]);

  // ── Rename handlers ────────────────────────────────────────────────────────
  function commitRename() {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== node.title) {
      updatePageMutation.mutate({ id: node.id, title: trimmed });
    }
    renaming = false;
  }

  function cancelRename() {
    renaming = false;
    renameValue = node.title ?? "";
  }
</script>

<div>
  <ContextMenu.Root items={menuItems}>
    {#snippet children({ openAt })}
      <div
        class="group flex items-center gap-1 px-1 py-0.5 rounded text-sm
               hover:bg-accent transition-colors cursor-pointer"
        class:bg-accent={isActive}
        style="padding-left: {depth * 12 + 4}px"
      >
        <!-- Expand toggle -->
        <button
          onclick={() => (expanded = !expanded)}
          class="w-4 h-4 text-muted-foreground flex-shrink-0 flex items-center justify-center"
          tabindex="-1"
        >
          {#if node.children.length > 0}
            {#if expanded}
              <ChevronDown class="w-3 h-3" />
            {:else}
              <ChevronRight class="w-3 h-3" />
            {/if}
          {/if}
        </button>

        <!-- Page icon -->
        <File class="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" strokeWidth={1.5} />

        <!-- Title / Rename input -->
        {#if renaming}
          <input
            bind:this={renameInputEl}
            bind:value={renameValue}
            onblur={commitRename}
            onkeydown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") cancelRename();
              e.stopPropagation();
            }}
            class="flex-1 text-sm bg-transparent border-b border-primary
                   outline-none truncate min-w-0 py-px"
          />
        {:else}
          <button
            onclick={() => goto(`/app/${node.id}`)}
            class="flex-1 text-left truncate"
          >
            {node.title || "Untitled"}
          </button>
        {/if}

        <!-- Hover actions (only when not renaming) -->
        {#if !renaming}
          <div class="hidden group-hover:flex items-center gap-0.5 shrink-0">
            <!-- Add sub-page -->
            <Tooltip.Root content="Add sub-page" side="top">
              <button
                onclick={() => onCreateChild(node.id)}
                class="w-5 h-5 flex items-center justify-center rounded
                       text-muted-foreground hover:text-foreground
                       hover:bg-accent-foreground/10 transition-colors"
                aria-label="Add sub-page"
              >
                <Plus class="w-3 h-3" />
              </button>
            </Tooltip.Root>
            <!-- More options — opens context menu -->
            <Tooltip.Root content="More options" side="top">
              <button
                onclick={(e) => {
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  openAt(r.right, r.bottom + 4);
                }}
                class="w-5 h-5 flex items-center justify-center rounded
                       text-muted-foreground hover:text-foreground
                       hover:bg-accent-foreground/10 transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal class="w-3 h-3" />
              </button>
            </Tooltip.Root>
          </div>
        {/if}
      </div>
    {/snippet}
  </ContextMenu.Root>

  {#if expanded && node.children.length > 0}
    {#each node.children as child (child.id)}
      <PageTreeItem node={child} depth={depth + 1} {onCreateChild} />
    {/each}
  {/if}
</div>
