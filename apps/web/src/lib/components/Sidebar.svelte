<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client.js";
  import { workspaceStore } from "$lib/stores/workspace.js";
  import { pageStore } from "$lib/stores/page.js";
  import { userStore } from "$lib/stores/user.js";
  import PageTreeItem from "./PageTreeItem.svelte";
  import CreateWorkspaceModal from "./CreateWorkspaceModal.svelte";
  import type { Workspace } from "$lib/stores/workspace.js";

  let ws = $derived($workspaceStore);
  let pages = $derived($pageStore);
  let user = $derived($userStore);
  let showCreateWs = $state(false);
  let collapsed = $state(false);

  // Guard: only reload pages when workspace actually changes, not on every render
  let loadedWorkspaceId = $state<string | null>(null);

  $effect(() => {
    const currentId = ws.current?.id ?? null;
    if (currentId && currentId !== loadedWorkspaceId) {
      loadedWorkspaceId = currentId;
      pageStore.load(currentId);
    }
    if (!currentId) {
      loadedWorkspaceId = null;
      pageStore.reset();
    }
  });

  async function selectWorkspace(workspace: Workspace) {
    workspaceStore.setCurrent(workspace);
  }

  async function createPage(parentId?: string) {
    if (!ws.current) return;
    const p = await pageStore.create({
      title: "Untitled",
      workspaceId: ws.current.id,
      parentId,
    });
    goto(`/app/${p.id}`);
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
      <span class="font-semibold text-sm truncate">{ws.current?.name ?? "Select workspace"}</span>
    {/if}
    <button
      onclick={() => (collapsed = !collapsed)}
      class="p-1 rounded hover:bg-accent text-muted-foreground"
      title={collapsed ? "Expand" : "Collapse"}
    >
      {collapsed ? "→" : "←"}
    </button>
  </div>

  {#if !collapsed}
    <!-- Workspace switcher -->
    <div class="px-2 py-2 border-b border-border">
      <p class="text-xs text-muted-foreground font-medium px-1 mb-1">WORKSPACES</p>
      {#each ws.workspaces as workspace (workspace.id)}
        <button
          onclick={() => selectWorkspace(workspace)}
          class="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors truncate"
          class:bg-accent={ws.current?.id === workspace.id}
          class:font-medium={ws.current?.id === workspace.id}
        >
          {workspace.name}
        </button>
      {/each}
      <button
        onclick={() => (showCreateWs = true)}
        class="w-full text-left px-2 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        + New workspace
      </button>
    </div>

    <!-- Pages tree -->
    <div class="flex-1 overflow-y-auto px-2 py-2">
      {#if ws.current}
        <div class="flex items-center justify-between px-1 mb-1">
          <p class="text-xs text-muted-foreground font-medium">PAGES</p>
          <button
            onclick={() => createPage()}
            class="text-xs text-muted-foreground hover:text-foreground px-1"
            title="New page"
          >+</button>
        </div>

        {#if pages.loading}
          <p class="text-xs text-muted-foreground px-1">Loading…</p>
        {:else if pages.tree.length === 0}
          <p class="text-xs text-muted-foreground px-1">No pages yet</p>
        {:else}
          {#each pages.tree as node (node.id)}
            <PageTreeItem {node} depth={0} onCreateChild={createPage} />
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
        <button
          onclick={logout}
          class="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent"
        >
          Out
        </button>
      </div>
    {/if}
  {/if}
</aside>

{#if showCreateWs}
  <CreateWorkspaceModal onclose={() => (showCreateWs = false)} />
{/if}
