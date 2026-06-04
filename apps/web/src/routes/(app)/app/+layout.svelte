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

  // Persist user to localStorage whenever fresh session data arrives.
  $effect(() => {
    if ($session.data?.user) {
      userStore.set($session.data.user as User);
    }
  });

  // App is ready when:
  // 1. Session confirmed with user (normal online path), OR
  // 2. We have a cached user AND the session is still loading OR we are offline.
  //    This prevents a spinner flash when:
  //    - The user was previously logged in (localStorage cache) and session is pending
  //    - The user comes back online and we are re-verifying in the background
  const ready = $derived(
    !!$session.data?.user ||
    ($userStore !== null && ($session.isPending || !$isOnline))
  );

  // Redirect to login ONLY when:
  // - Online (not a transient network failure)
  // - Session finished loading (not pending)
  // - No network/fetch error (genuinely unauthenticated, not an offline failure)
  // - No user in session response
  $effect(() => {
    if ($isOnline && !$session.isPending && !$session.error && !$session.data?.user) {
      userStore.set(null);
      const redirectTo = $page.url.pathname + $page.url.search;
      goto(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  });

  // Re-verify session against server when connection is restored.
  // Only redirect on explicit server confirmation that the session is invalid;
  // any fetch/network error is treated as a transient failure — stay in the app.
  let prevOnline = $state($isOnline);
  $effect(() => {
    const online = $isOnline;
    if (online && !prevOnline && $userStore !== null) {
      authClient.getSession().then((result) => {
        const requestSucceeded = !result.error;
        const sessionInvalid = requestSucceeded && !result.data?.user;
        if (sessionInvalid) {
          userStore.set(null);
          const redirectTo = $page.url.pathname + $page.url.search;
          goto(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
        }
        // If result.error is set (network/server error), stay in app — userStore
        // remains valid so the user can continue working offline-style.
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
