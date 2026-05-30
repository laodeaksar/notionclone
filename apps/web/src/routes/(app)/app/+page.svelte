<script lang="ts">
  import { workspaceStore } from "$lib/stores/workspace.js";
  import CreateWorkspaceModal from "$lib/components/CreateWorkspaceModal.svelte";

  let showCreate = $state(false);
  let ws = $derived($workspaceStore);
</script>

<div class="flex h-full items-center justify-center">
  {#if ws.loading}
    <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  {:else if ws.workspaces.length === 0}
    <div class="text-center space-y-4">
      <div class="text-6xl">📝</div>
      <h2 class="text-2xl font-semibold">No workspaces yet</h2>
      <p class="text-muted-foreground">Create your first workspace to get started</p>
      <button
        onclick={() => (showCreate = true)}
        class="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Create Workspace
      </button>
    </div>
  {:else}
    <div class="text-center space-y-4">
      <div class="text-5xl">👈</div>
      <h2 class="text-xl font-semibold text-muted-foreground">Select a page from the sidebar</h2>
    </div>
  {/if}
</div>

{#if showCreate}
  <CreateWorkspaceModal onclose={() => (showCreate = false)} />
{/if}
