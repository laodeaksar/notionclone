<script lang="ts">
  import { page as pageParam } from "$app/stores";
  import { userStore } from "$lib/stores/user.js";
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { pageQueryOptions, pageKey, pagesKey, updatePageFn } from "$lib/queries.js";
  import { currentWorkspaceId } from "$lib/stores/workspace.js";
  import PageEditor from "$lib/components/PageEditor.svelte";

  const qc = useQueryClient();

  let pageId = $derived($pageParam.params.pageId);
  let user = $derived($userStore);

  // ── Page query ────────────────────────────────────────────────────────────
  const pageQuery = createQuery(() => pageQueryOptions(pageId));
  const currentPage = $derived(pageQuery.data ?? null);
  const loading = $derived(pageQuery.isPending);
  const notFound = $derived(pageQuery.isError);

  // ── Update title mutation ─────────────────────────────────────────────────
  const updateTitle = createMutation(() => ({
    mutationFn: updatePageFn,
    onSuccess: (updated) => {
      // Update page cache
      qc.setQueryData(pageKey(updated.id), updated);
      // Refresh sidebar pages list
      if ($currentWorkspaceId) {
        qc.invalidateQueries({ queryKey: pagesKey($currentWorkspaceId) });
      }
    },
  }));

  function handleTitleChange(title: string) {
    if (!currentPage) return;
    updateTitle.mutate({ id: currentPage.id, title });
  }

  function handleRestore() {
    // Re-fetch page after a version restore
    qc.invalidateQueries({ queryKey: pageKey(pageId) });
  }
</script>

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
