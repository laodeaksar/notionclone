<script lang="ts">
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { goto } from "$app/navigation";
  import {
    pagesQueryOptions, workspacesQueryOptions,
    createPageFn, pagesKey,
  } from "$lib/queries.js";
  import { currentWorkspaceId } from "$lib/stores/workspace.js";
  import CreateWorkspaceModal from "$lib/components/CreateWorkspaceModal.svelte";
  import { FilePlus, FileText, Clock, Layers } from "lucide-svelte";

  let showCreate = $state(false);
  let workspaceId = $state<string | null>(null);
  currentWorkspaceId.subscribe((id) => { workspaceId = id; });

  const workspacesQuery = createQuery(() => workspacesQueryOptions());
  const workspaces = $derived(workspacesQuery.data ?? []);
  const hasNoWorkspaces = $derived(
    !workspacesQuery.isPending && workspaces.length === 0
  );
  const currentWorkspace = $derived(
    workspaces.find((w) => w.id === workspaceId) ?? null
  );

  const pagesQuery = createQuery(() => ({
    ...pagesQueryOptions(workspaceId ?? ""),
    enabled: !!workspaceId,
  }));

  const pages = $derived(
    [...(pagesQuery.data ?? [])].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  );

  const isLoadingPages = $derived(pagesQuery.isPending && !!workspaceId);

  const qc = useQueryClient();
  const createMut = createMutation(() => ({
    mutationFn: createPageFn,
    onSuccess(page) {
      qc.invalidateQueries({ queryKey: pagesKey(workspaceId ?? "") });
      goto(`/app/${page.id}`);
    },
  }));

  function handleCreate() {
    if (!workspaceId || createMut.isPending) return;
    createMut.mutate({ title: "Untitled", workspaceId });
  }

  function greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
</script>

<!-- ── Loading ────────────────────────────────────────────────────────────────── -->
{#if workspacesQuery.isPending}
  <div class="flex h-full items-center justify-center">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>

<!-- ── No workspaces ─────────────────────────────────────────────────────────── -->
{:else if hasNoWorkspaces}
  <div class="flex h-full items-center justify-center">
    <div class="text-center space-y-4">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
        <Layers class="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 class="text-xl font-semibold">No workspaces yet</h2>
      <p class="text-sm text-muted-foreground">Create your first workspace to get started</p>
      <button
        onclick={() => (showCreate = true)}
        class="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Create Workspace
      </button>
    </div>
  </div>

<!-- ── No workspace selected ─────────────────────────────────────────────────── -->
{:else if !workspaceId}
  <div class="flex h-full items-center justify-center">
    <div class="text-center space-y-3">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
        <Layers class="h-7 w-7 text-muted-foreground" />
      </div>
      <p class="text-sm text-muted-foreground">Select a workspace from the sidebar</p>
    </div>
  </div>

<!-- ── Home with workspace ────────────────────────────────────────────────────── -->
{:else}
  <div class="h-full overflow-y-auto">
    <div class="mx-auto max-w-3xl px-6 py-12">

      <!-- Greeting -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">{greeting()}</h1>
        {#if currentWorkspace}
          <p class="mt-1 text-sm text-muted-foreground">
            {currentWorkspace.name} workspace
          </p>
        {/if}
      </div>

      <!-- Quick actions -->
      <div class="mb-8 flex gap-3">
        <button
          onclick={handleCreate}
          disabled={createMut.isPending}
          class="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FilePlus class="h-4 w-4" />
          {createMut.isPending ? "Creating…" : "New page"}
        </button>
      </div>

      <!-- Pages list -->
      {#if isLoadingPages}
        <div class="space-y-2">
          {#each { length: 5 } as _}
            <div class="h-12 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        </div>

      {:else if pages.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <FileText class="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 class="text-base font-medium">No pages yet</h3>
          <p class="mt-1 text-sm text-muted-foreground">Create your first page to start writing</p>
          <button
            onclick={handleCreate}
            disabled={createMut.isPending}
            class="mt-4 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {createMut.isPending ? "Creating…" : "Create page"}
          </button>
        </div>

      {:else}
        <div>
          <div class="mb-3 flex items-center gap-2">
            <Clock class="h-3.5 w-3.5 text-muted-foreground" />
            <span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recently updated
            </span>
          </div>
          <div class="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {#each pages as page (page.id)}
              <a
                href="/app/{page.id}"
                class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors group"
              >
                <!-- Icon -->
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-base leading-none">
                  {#if page.icon}
                    {page.icon}
                  {:else}
                    <FileText class="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {/if}
                </span>

                <!-- Title -->
                <span class="flex-1 truncate font-medium text-foreground">
                  {page.title || "Untitled"}
                </span>

                <!-- Relative time -->
                <span class="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {relativeTime(page.updatedAt)}
                </span>
              </a>
            {/each}
          </div>
        </div>
      {/if}

    </div>
  </div>
{/if}

{#if showCreate}
  <CreateWorkspaceModal onclose={() => (showCreate = false)} />
{/if}
