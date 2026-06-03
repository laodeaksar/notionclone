<script lang="ts">
  import { page as pageParam } from "$app/stores";
  import { pageStore } from "$lib/stores/page.js";
  import { userStore } from "$lib/stores/user.js";
  import { api } from "$lib/eden.js";
  import PageEditor from "$lib/components/PageEditor.svelte";
  import type { Page } from "$lib/stores/page.js";

  let pageId = $derived($pageParam.params.pageId);
  let user = $derived($userStore);
  let currentPage = $state<Page | null>(null);
  let loading = $state(true);
  let notFound = $state(false);

  $effect(() => {
    if (pageId) {
      loadPage(pageId);
    }
  });

  async function loadPage(id: string) {
    loading = true;
    notFound = false;
    try {
      const res = await api.api.pages[":id"].$get({ param: { id } });
      if (!res.ok) {
        notFound = true;
        return;
      }
      currentPage = (await res.json()) as Page;
      pageStore.setCurrent(currentPage);
    } finally {
      loading = false;
    }
  }

  async function handleTitleChange(title: string) {
    if (!currentPage) return;
    currentPage = { ...currentPage, title };
    await pageStore.updatePage(currentPage.id, { title });
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
  <PageEditor page={currentPage} onTitleChange={handleTitleChange} />
{/if}
