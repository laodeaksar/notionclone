<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client.js";
  import { userStore } from "$lib/stores/user.js";
  import { themeStore } from "$lib/stores/theme.js";
  import { currentWorkspaceId } from "$lib/stores/workspace.js";
  import { buildTree } from "$lib/stores/page.js";
  import {
    workspacesQueryOptions,
    pagesQueryOptions,
    pagesKey,
    createPageFn,
  } from "$lib/queries.js";
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { PanelLeftClose, PanelLeftOpen, ChevronDown, X } from "lucide-svelte";

  import WorkspaceSwitcherModal from "./sidebar/WorkspaceSwitcherModal.svelte";
  import SidebarPageTree from "./sidebar/SidebarPageTree.svelte";
  import SidebarFooter from "./sidebar/SidebarFooter.svelte";
  import CreateWorkspaceModal from "./CreateWorkspaceModal.svelte";

  let {
    onClose,
  }: {
    onClose?: () => void;
  } = $props();

  const qc = useQueryClient();

  let user = $derived($userStore);
  let theme = $derived($themeStore);
  let collapsed = $state(false);
  let showWorkspaceSwitcher = $state(false);
  let showCreateWs = $state(false);

  // ── Workspaces ─────────────────────────────────────────────────────────────
  const workspacesQuery = createQuery(() => workspacesQueryOptions());
  const workspaces = $derived(workspacesQuery.data ?? []);

  $effect(() => {
    if (workspaces.length > 0 && !$currentWorkspaceId) {
      currentWorkspaceId.set(workspaces[0].id);
    }
  });

  const currentWs = $derived(
    workspaces.find((w) => w.id === $currentWorkspaceId) ?? null
  );

  // ── Pages ──────────────────────────────────────────────────────────────────
  const pagesQuery = createQuery(() =>
    pagesQueryOptions($currentWorkspaceId ?? "")
  );
  const pagesTree = $derived(buildTree(pagesQuery.data ?? []));
  const pagesLoading = $derived(
    pagesQuery.isPending && ($currentWorkspaceId?.length ?? 0) > 0
  );

  // ── Create page ────────────────────────────────────────────────────────────
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
    createPage.mutate({ title: "Untitled", workspaceId: $currentWorkspaceId, parentId });
  }

  async function logout() {
    await authClient.signOut();
    goto("/login");
  }
</script>

<aside
  class="h-full border-r border-border bg-muted/30 flex flex-col overflow-hidden
         transition-all duration-200"
  class:w-64={!collapsed}
  class:w-12={collapsed}
>
  <!-- Header -->
  <div class="flex items-center gap-2 px-3 py-3 border-b border-border min-w-0">
    {#if !collapsed}
      <button
        onclick={() => (showWorkspaceSwitcher = true)}
        class="flex-1 min-w-0 flex items-center gap-1.5 text-left rounded-md px-1 py-0.5
               hover:bg-accent transition-colors group"
        title="Switch workspace"
      >
        <span class="font-semibold text-sm truncate flex-1">
          {currentWs?.name ?? "Select workspace"}
        </span>
        <ChevronDown
          class="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
        />
      </button>
    {/if}

    <!-- Collapse toggle — hidden on mobile (drawer handles open/close) -->
    <button
      onclick={() => (collapsed = !collapsed)}
      class="p-1 rounded hover:bg-accent text-muted-foreground transition-colors shrink-0
             hidden md:flex"
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {#if collapsed}
        <PanelLeftOpen class="w-4 h-4" />
      {:else}
        <PanelLeftClose class="w-4 h-4" />
      {/if}
    </button>

    <!-- Close button — only visible on mobile drawer -->
    <button
      onclick={onClose}
      class="p-1 rounded hover:bg-accent text-muted-foreground transition-colors shrink-0
             flex md:hidden"
      aria-label="Close menu"
    >
      <X class="w-4 h-4" />
    </button>
  </div>

  {#if !collapsed}
    <SidebarPageTree
      {currentWs}
      {pagesTree}
      {pagesLoading}
      createIsPending={createPage.isPending}
      onCreatePage={handleCreatePage}
    />

    <SidebarFooter
      {user}
      {theme}
      onToggleTheme={() => themeStore.toggle()}
      onLogout={logout}
    />
  {/if}
</aside>

<!-- Modals (rendered outside aside to avoid clipping) -->
{#if showWorkspaceSwitcher}
  <WorkspaceSwitcherModal
    {workspaces}
    currentWorkspaceId={$currentWorkspaceId}
    onSelect={(ws) => currentWorkspaceId.set(ws.id)}
    onClose={() => (showWorkspaceSwitcher = false)}
    onCreateNew={() => (showCreateWs = true)}
  />
{/if}

{#if showCreateWs}
  <CreateWorkspaceModal onclose={() => (showCreateWs = false)} />
{/if}
