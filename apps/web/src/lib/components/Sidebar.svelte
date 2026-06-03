<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client.js";
  import { userStore } from "$lib/stores/user.js";
  import { themeStore } from "$lib/stores/theme.js";
  import { currentWorkspaceId, type Workspace } from "$lib/stores/workspace.js";
  import { buildTree } from "$lib/stores/page.js";
  import {
    workspacesQueryOptions,
    pagesQueryOptions,
    pagesKey,
    createPageFn,
  } from "$lib/queries.js";
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { PanelLeftClose, PanelLeftOpen, Plus, Sun, Moon, LogOut } from "lucide-svelte";
  import PageTreeItem from "./PageTreeItem.svelte";
  import CreateWorkspaceModal from "./CreateWorkspaceModal.svelte";

  const qc = useQueryClient();

  let theme = $derived($themeStore);
  let user = $derived($userStore);
  let showCreateWs = $state(false);
  let collapsed = $state(false);

  // ── Workspaces query ──────────────────────────────────────────────────────
  const workspacesQuery = createQuery(() => workspacesQueryOptions());
  const workspaces = $derived(workspacesQuery.data ?? []);

  // Auto-select first workspace when loaded
  $effect(() => {
    if (workspaces.length > 0 && !$currentWorkspaceId) {
      currentWorkspaceId.set(workspaces[0].id);
    }
  });

  const currentWs = $derived(
    workspaces.find((w) => w.id === $currentWorkspaceId) ?? null
  );

  // ── Pages query ───────────────────────────────────────────────────────────
  const pagesQuery = createQuery(() =>
    pagesQueryOptions($currentWorkspaceId ?? "")
  );
  const pagesTree = $derived(buildTree(pagesQuery.data ?? []));
  const pagesLoading = $derived(
    pagesQuery.isPending && ($currentWorkspaceId?.length ?? 0) > 0
  );

  // ── Create page mutation ──────────────────────────────────────────────────
  const createPage = createMutation(() => ({
    mutationFn: createPageFn,
    onSuccess: async (page) => {
      if ($currentWorkspaceId) {
        await qc.invalidateQueries({ queryKey: pagesKey($currentWorkspaceId) });
      }
      goto(`/app/${page.id}`);
    },
  }));

  function handleCreatePage(parentId?: string) {
    if (!$currentWorkspaceId) return;
    createPage.mutate({
      title: "Untitled",
      workspaceId: $currentWorkspaceId,
      parentId,
    });
  }

  function selectWorkspace(workspace: Workspace) {
    currentWorkspaceId.set(workspace.id);
  }

  async function logout() {
    await authClient.signOut();
    goto("/login");
  }
</script>

<aside
  class="shrink-0 h-full border-r border-border bg-muted/30 flex flex-col overflow-hidden transition-all"
  class:w-64={!collapsed}
  class:w-12={collapsed}
>
  <!-- Header -->
  <div class="flex items-center justify-between px-3 py-3 border-b border-border">
    {#if !collapsed}
      <span class="font-semibold text-sm truncate">{currentWs?.name ?? "Select workspace"}</span>
    {/if}
    <button
      onclick={() => (collapsed = !collapsed)}
      class="p-1 rounded hover:bg-accent text-muted-foreground transition-colors"
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {#if collapsed}
        <PanelLeftOpen class="w-4 h-4" />
      {:else}
        <PanelLeftClose class="w-4 h-4" />
      {/if}
    </button>
  </div>

  {#if !collapsed}
    <!-- Workspace switcher -->
    <div class="px-2 py-2 border-b border-border">
      <p class="text-xs text-muted-foreground font-medium px-1 mb-1">WORKSPACES</p>
      {#each workspaces as workspace (workspace.id)}
        <button
          onclick={() => selectWorkspace(workspace)}
          class="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors truncate"
          class:bg-accent={$currentWorkspaceId === workspace.id}
          class:font-medium={$currentWorkspaceId === workspace.id}
        >
          {workspace.name}
        </button>
      {/each}
      <button
        onclick={() => (showCreateWs = true)}
        class="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Plus class="w-3.5 h-3.5" />
        New workspace
      </button>
    </div>

    <!-- Pages tree -->
    <div class="flex-1 overflow-y-auto px-2 py-2">
      {#if currentWs}
        <div class="flex items-center justify-between px-1 mb-1">
          <p class="text-xs text-muted-foreground font-medium">PAGES</p>
          <button
            onclick={() => handleCreatePage()}
            disabled={createPage.isPending}
            class="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            title="New page"
          >
            <Plus class="w-3.5 h-3.5" />
          </button>
        </div>

        {#if pagesLoading}
          <p class="text-xs text-muted-foreground px-1">Loading…</p>
        {:else if pagesTree.length === 0}
          <p class="text-xs text-muted-foreground px-1">No pages yet</p>
        {:else}
          {#each pagesTree as node (node.id)}
            <PageTreeItem {node} depth={0} onCreateChild={handleCreatePage} />
          {/each}
        {/if}
      {/if}
    </div>

    <!-- Footer -->
    {#if user}
      <div class="border-t border-border px-3 py-2 flex items-center justify-between">
        <div class="min-w-0">
          <p class="text-sm font-medium truncate">{user.name}</p>
          <p class="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <div class="flex items-center gap-1">
          <button
            onclick={() => themeStore.toggle()}
            class="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {#if theme === "dark"}
              <Sun class="w-4 h-4" />
            {:else}
              <Moon class="w-4 h-4" />
            {/if}
          </button>
          <button
            onclick={logout}
            class="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    {/if}
  {/if}
</aside>

{#if showCreateWs}
  <CreateWorkspaceModal onclose={() => (showCreateWs = false)} />
{/if}
