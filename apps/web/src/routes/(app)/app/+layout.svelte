<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient, useSession } from "$lib/auth-client.js";
  import { userStore, type User } from "$lib/stores/user.js";
  import { isOnline } from "$lib/stores/network.js";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import CommandPalette from "$lib/components/CommandPalette.svelte";
  import OfflineIndicator from "$lib/components/OfflineIndicator.svelte";

  let { children } = $props();
  let paletteOpen = $state(false);

  const session = useSession();

  // Persist user to localStorage whenever session data arrives.
  $effect(() => {
    if ($session.data?.user) {
      userStore.set($session.data.user as User);
    }
  });

  // App is ready when:
  // 1. Session confirmed with user (normal online path), OR
  // 2. Offline but a user exists in the localStorage-backed store
  //    (user was previously authenticated; SW/IDB cache may serve data)
  const ready = $derived(
    !!$session.data?.user ||
    (!$isOnline && $userStore !== null)
  );

  // Redirect to login ONLY when:
  // - Online (not a transient network failure)
  // - Session finished loading (not pending)
  // - No network error (genuinely unauthenticated, not a fetch failure)
  // - No user in session response
  $effect(() => {
    if ($isOnline && !$session.isPending && !$session.error && !$session.data?.user) {
      userStore.set(null);
      const redirectTo = $page.url.pathname + $page.url.search;
      goto(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  });

  // Re-verify session against server when connection is restored.
  // Track previous online state to detect transitions.
  let prevOnline = $state($isOnline);
  $effect(() => {
    const online = $isOnline;
    if (online && !prevOnline && $userStore !== null) {
      authClient.getSession().then((result) => {
        if (!result.data?.user) {
          userStore.set(null);
          const redirectTo = $page.url.pathname + $page.url.search;
          goto(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
        }
      });
    }
    prevOnline = online;
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

<OfflineIndicator />
