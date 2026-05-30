<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page as pageParam } from "$app/stores";
  import { authClient } from "$lib/auth-client.js";
  import { pageStore } from "$lib/stores/page.js";
  import PageEditor from "$lib/components/PageEditor.svelte";
  import { api } from "$lib/eden.js";

  let pageId = $derived($pageParam.params.pageId);
  let currentPage = $state<{
    id: string;
    title: string;
    icon: string | null;
    coverImage: string | null;
    workspaceId: string;
    parentId: string | null;
    createdBy: string;
  } | null>(null);
  let user = $state<{ id: string; name: string; email: string } | null>(null);
  let loading = $state(true);

  $effect(() => {
    if (pageId) {
      loadPage(pageId);
    }
  });

  async function loadPage(id: string) {
    loading = true;
    try {
      const session = await authClient.getSession();
      user = (session.data?.user as typeof user) ?? null;

      const res = await fetch(`/api/pages/${id}`, { credentials: "include" });
      if (res.ok) {
        currentPage = await res.json();
        pageStore.setCurrent(currentPage);
      }
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
{:else if currentPage && user}
  <PageEditor page={currentPage} userName={user.name} onTitleChange={handleTitleChange} />
{:else}
  <div class="flex h-full items-center justify-center text-muted-foreground">
    Page not found
  </div>
{/if}
