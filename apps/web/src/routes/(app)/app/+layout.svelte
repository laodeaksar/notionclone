<script lang="ts">
  import { goto } from "$app/navigation";
  import { useSession } from "$lib/auth-client.js";
  import { userStore, type User } from "$lib/stores/user.js";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import CommandPalette from "$lib/components/CommandPalette.svelte";

  let { children } = $props();
  let paletteOpen = $state(false);

  const session = useSession();

  // Derive ready state: only true when session is confirmed and user exists
  const ready = $derived(!$session.isPending && !!$session.data?.user);

  $effect(() => {
    // Sync user store whenever session resolves
    if ($session.data?.user) {
      userStore.set($session.data.user as User);
    }
    // Only redirect when we definitively know there is no session
    // (not pending, no error, no user)
    if (!$session.isPending && !$session.error && !$session.data?.user) {
      goto("/login");
    }
  });

  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<div class="flex h-screen overflow-hidden bg-background">
  {#if ready}
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      {@render children()}
    </main>
    <CommandPalette bind:open={paletteOpen} />
  {:else}
    <div class="flex h-full w-full items-center justify-center">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  {/if}
</div>
