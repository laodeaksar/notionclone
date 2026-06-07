<script lang="ts">
  import { goto } from "$app/navigation";
  import { page as pageParam } from "$app/stores";
  import { userStore } from "$lib/stores/user.js";
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { pageQueryOptions, pageKey, pagesKey, pagesQueryOptions, updatePageFn, deletePageFn } from "$lib/queries.js";
  import { currentWorkspaceId } from "$lib/stores/workspace.js";
  import { currentPageMeta } from "$lib/stores/page.js";
  import { breadcrumbStore } from "$lib/stores/breadcrumb.js";
  import PageEditor from "$lib/components/PageEditor.svelte";

  const qc = useQueryClient();

  let pageId = $derived($pageParam.params.pageId);
  let user = $derived($userStore);

  // ── Page query ────────────────────────────────────────────────────────────
  const pageQuery = createQuery(() => pageQueryOptions(pageId ?? ""));
  const currentPage = $derived(pageQuery.data ?? null);
  const loading = $derived(pageQuery.isPending);
  const notFound = $derived(pageQuery.isError);

  // ── All pages (for breadcrumb ancestry) ──────────────────────────────────
  const pagesQuery = createQuery(() =>
    pagesQueryOptions($currentWorkspaceId ?? "")
  );

  // ── Update title mutation ─────────────────────────────────────────────────
  const updateTitle = createMutation(() => ({
    mutationFn: updatePageFn,
    onSuccess: (updated) => {
      qc.setQueryData(pageKey(updated.id), updated);
      if ($currentWorkspaceId) {
        qc.invalidateQueries({ queryKey: pagesKey($currentWorkspaceId) });
      }
    },
  }));

  // Keep breadcrumb store + mobile meta in sync with the open page
  $effect(() => {
    if (currentPage) {
      currentPageMeta.set({ title: currentPage.title, icon: currentPage.icon });
      breadcrumbStore.set({ page: currentPage, pages: pagesQuery.data ?? [] });
    } else {
      currentPageMeta.set(null);
      breadcrumbStore.set(null);
    }
    return () => {
      currentPageMeta.set(null);
      breadcrumbStore.set(null);
    };
  });

  // Keep breadcrumb pages list up to date as pagesQuery resolves
  $effect(() => {
    if (currentPage && pagesQuery.data) {
      breadcrumbStore.update((b) => (b ? { ...b, pages: pagesQuery.data! } : b));
    }
  });

  function handleTitleChange(title: string) {
    if (!currentPage) return;
    updateTitle.mutate({ id: currentPage.id, title });
  }

  function handleRestore() {
    qc.invalidateQueries({ queryKey: pageKey(pageId ?? "") });
  }

  // ── Delete page mutation ──────────────────────────────────────────────────
  const deletePage = createMutation(() => ({
    mutationFn: deletePageFn,
    onSuccess: async () => {
      if (currentPage && $currentWorkspaceId) {
        await qc.invalidateQueries({ queryKey: pagesKey($currentWorkspaceId) });
      }
      goto("/app");
    },
  }));

  function handleDeleteShortcut(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
      e.preventDefault();
      if (!currentPage) return;
      if (confirm(`Delete "${currentPage.title || "Untitled"}"? This cannot be undone.`)) {
        deletePage.mutate(currentPage.id);
      }
    }
  }
</script>

<svelte:window onkeydown={handleDeleteShortcut} />

{#if loading}
  <div class="flex h-full items-center justify-center">
    <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
{:else if notFound || !currentPage}
  <div class="flex h-full items-center justify-center text-muted-foreground">
    Page not found
  </div>
{:else if user}
  <PageEditor page={currentPage} onTitleChange={handleTitleChange} onRestore={handleRestore} />
{/if}
