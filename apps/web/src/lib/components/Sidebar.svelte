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
  import { PanelLeftClose, PanelLeftOpen, X, Plus } from "lucide-svelte";
  import { Tooltip, Select, Avatar } from "@notion-clone/ui";

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
  let showCreateWs = $state(false);

  // ── Workspaces ─────────────────────────────────────────────────────────────
  const workspacesQuery = createQuery(() => workspacesQueryOptions());
  const workspaces = $derived(workspacesQuery.data ?? []);

  $effect(() => {
    if (workspaces.length > 0 && !$currentWorkspaceId) {
      currentWorkspaceId.set(workspaces[0].id);
    }
  });

  const wsOptions = $derived(
    workspaces.map((w) => ({
      value: w.id,
      label: w.name,
      description: w.description ?? undefined,
    }))
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
  class="flex flex-col overflow-hidden transition-all duration-200
         h-full bg-background
         md:border-r md:border-border
         {collapsed ? 'md:w-12' : 'md:w-64'}"
>
  <!-- Header -->
  <div class="flex items-center gap-1 px-2 py-2.5 border-b border-border min-w-0">
    {#if !collapsed}
      <!-- Inline workspace Select -->
      <Select.Root
        options={wsOptions}
        value={$currentWorkspaceId as string | undefined}
        onValueChange={(id: string) => currentWorkspaceId.set(id)}
        placeholder="Select workspace"
        class="flex-1 min-w-0"
      >
        {#snippet renderItem(opt, isSelected)}
          <Avatar.Root fallback={opt.label} size="sm" class="rounded-md shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{opt.label}</p>
            {#if opt.description}
              <p class="text-xs text-muted-foreground truncate">{opt.description}</p>
            {/if}
          </div>
        {/snippet}

        {#snippet footer()}
          <button
            onclick={() => (showCreateWs = true)}
            class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm
                   text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <div class="w-6 h-6 shrink-0 rounded-md border-2 border-dashed border-border
                        flex items-center justify-center">
              <Plus class="w-3.5 h-3.5" />
            </div>
            New workspace
          </button>
        {/snippet}
      </Select.Root>
    {/if}

    <!-- Collapse toggle — hidden on mobile -->
    <Tooltip.Root
      content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      shortcut="⌘\"
      side="right"
      class="hidden md:inline-flex shrink-0"
    >
      <button
        onclick={() => (collapsed = !collapsed)}
        class="p-1 rounded hover:bg-accent text-muted-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {#if collapsed}
          <PanelLeftOpen class="w-4 h-4" />
        {:else}
          <PanelLeftClose class="w-4 h-4" />
        {/if}
      </button>
    </Tooltip.Root>

    <!-- Close button — mobile drawer only -->
    <Tooltip.Root content="Close menu" side="right" class="flex md:hidden shrink-0">
      <button
        onclick={onClose}
        class="p-1 rounded hover:bg-accent text-muted-foreground transition-colors"
        aria-label="Close menu"
      >
        <X class="w-4 h-4" />
      </button>
    </Tooltip.Root>
  </div>

  {#if !collapsed}
    <SidebarPageTree
      currentWs={workspaces.find((w) => w.id === $currentWorkspaceId) ?? null}
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

{#if showCreateWs}
  <CreateWorkspaceModal onclose={() => (showCreateWs = false)} />
{/if}
