<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient, useSession } from "$lib/auth-client.js";
  import { userStore, type User } from "$lib/stores/user.js";
  import { isOnline } from "$lib/stores/network.js";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import CommandPalette from "$lib/components/CommandPalette.svelte";
  import OfflineIndicator from "$lib/components/OfflineIndicator.svelte";
  import { Menu } from "lucide-svelte";

  let { children } = $props();
  let paletteOpen = $state(false);
  let drawerOpen = $state(false);

  const session = useSession();

  $effect(() => {
    if ($session.data?.user) {
      userStore.set($session.data.user as User);
    }
  });

  const ready = $derived(
    !!$session.data?.user ||
    ($userStore !== null && ($session.isPending || !$isOnline))
  );

  $effect(() => {
    if ($isOnline && !$session.isPending && !$session.error && !$session.data?.user) {
      userStore.set(null);
      const redirectTo = $page.url.pathname + $page.url.search;
      goto(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  });

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
      });
    }
    prevOnline = online;
  });

  // Close drawer whenever the route changes (user tapped a page link)
  $effect(() => {
    $page.url.pathname;
    drawerOpen = false;
  });

  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    }
    if (e.key === "Escape" && drawerOpen) {
      drawerOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<div class="flex h-screen overflow-hidden bg-background">
  {#if ready}
    <!-- Mobile backdrop -->
    {#if drawerOpen}
      <div
        class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] md:hidden"
        role="button"
        tabindex="-1"
        aria-label="Close menu"
        onclick={() => (drawerOpen = false)}
        onkeydown={(e) => e.key === "Escape" && (drawerOpen = false)}
      ></div>
    {/if}

    <!-- Sidebar: always static on md+, slide-in drawer on mobile -->
    <div
      class="fixed inset-y-0 left-0 z-40 md:relative md:z-auto md:translate-x-0
             transition-transform duration-200 ease-out will-change-transform"
      class:-translate-x-full={!drawerOpen}
      class:translate-x-0={drawerOpen}
    >
      <Sidebar onClose={() => (drawerOpen = false)} />
    </div>

    <!-- Main area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Mobile top bar (hamburger) — hidden on desktop -->
      <div class="flex items-center h-12 px-4 border-b border-border shrink-0 md:hidden bg-background">
        <button
          onclick={() => (drawerOpen = !drawerOpen)}
          class="p-1.5 -ml-1.5 rounded-md text-muted-foreground hover:text-foreground
                 hover:bg-accent transition-colors"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>

      <main class="flex-1 overflow-y-auto">
        {@render children()}
      </main>
    </div>

    <CommandPalette bind:open={paletteOpen} />
  {:else}
    <div class="flex h-full w-full items-center justify-center">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  {/if}
</div>

<OfflineIndicator />
