<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client.js";
  import { userStore, type User } from "$lib/stores/user.js";
  import Sidebar from "$lib/components/Sidebar.svelte";

  let { children } = $props();
  let ready = $state(false);

  onMount(async () => {
    const session = await authClient.getSession();
    if (!session.data?.user) {
      goto("/login");
      return;
    }
    userStore.set(session.data.user as User);
    ready = true;
  });
</script>

<div class="flex h-screen overflow-hidden bg-background">
  {#if ready}
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      {@render children()}
    </main>
  {:else}
    <div class="flex h-full w-full items-center justify-center">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  {/if}
</div>
