<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient, useSession } from "$lib/auth-client.js";
  import { userStore, type User } from "$lib/stores/user.js";
  import { isOnline } from "$lib/stores/network.js";
  import { currentPageMeta } from "$lib/stores/page.js";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import CommandPalette from "$lib/components/CommandPalette.svelte";
  import OfflineIndicator from "$lib/components/OfflineIndicator.svelte";
  import { Menu } from "lucide-svelte";

  let { children } = $props();
  let paletteOpen = $state(false);
  let drawerOpen = $state(false);

  // ── Swipe gesture ──────────────────────────────────────────────────────────
  const EDGE_ZONE   = 24;   // px from left edge that starts an open-swipe
  const THRESHOLD   = 60;   // px of horizontal travel to commit open/close
  const SIDEBAR_W   = 256;  // matches w-64 = 16rem = 256px

  let touchStartX  = 0;
  let touchStartY  = 0;
  let dragging     = $state(false);
  let dragOffsetX  = $state(0); // live offset applied while finger moves
  let sidebarEl    = $state<HTMLElement | null>(null);

  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    dragging = false;
    dragOffsetX = 0;
  }

  function onTouchMove(e: TouchEvent) {
    const t = e.touches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    // Only handle clearly horizontal swipes
    if (Math.abs(dx) < Math.abs(dy)) return;

    if (!drawerOpen && touchStartX <= EDGE_ZONE && dx > 0) {
      // Opening swipe: clamp between 0 and SIDEBAR_W
      dragging = true;
      dragOffsetX = Math.min(dx, SIDEBAR_W);
      e.preventDefault();
    } else if (drawerOpen && dx < 0) {
      // Closing swipe: clamp between -SIDEBAR_W and 0
      dragging = true;
      dragOffsetX = Math.max(dx, -SIDEBAR_W);
      e.preventDefault();
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (!dragging) return;
    const dx = e.changedTouches[0].clientX - touchStartX;

    if (!drawerOpen && dx >= THRESHOLD) {
      drawerOpen = true;
    } else if (drawerOpen && dx <= -THRESHOLD) {
      drawerOpen = false;
    }

    dragging = false;
    dragOffsetX = 0;
  }

  // Compute live sidebar transform: base position + drag delta
  const sidebarTransform = $derived(() => {
    const base = drawerOpen ? 0 : -SIDEBAR_W;
    if (!dragging) return `translateX(${base}px)`;
    return `translateX(${Math.min(0, Math.max(-SIDEBAR_W, base + dragOffsetX))}px)`;
  });

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
    if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
      e.preventDefault();
      drawerOpen = !drawerOpen;
    }
    if (e.key === "Escape" && drawerOpen) {
      drawerOpen = false;
    }
  }
</script>

<svelte:window
  onkeydown={handleGlobalKeydown}
  ontouchstart={onTouchStart}
  ontouchmove={onTouchMove}
  ontouchend={onTouchEnd}
/>

<div class="flex h-screen overflow-hidden bg-background">
  {#if ready}
    <!-- Mobile backdrop: visible when open or being dragged open -->
    {#if drawerOpen || dragging}
      <div
        class="fixed inset-0 z-30 md:hidden"
        style:background-color="rgba(0,0,0,{dragging
          ? Math.min(0.4, (dragOffsetX / SIDEBAR_W) * 0.4)
          : 0.4})"
        style:backdrop-filter={drawerOpen && !dragging ? 'blur(1px)' : 'none'}
        role="button"
        tabindex="-1"
        aria-label="Close menu"
        onclick={() => (drawerOpen = false)}
        onkeydown={(e) => e.key === "Escape" && (drawerOpen = false)}
      ></div>
    {/if}

    <!-- Sidebar: always static on md+, slide-in drawer on mobile -->
    <div
      class="fixed inset-y-0 left-0 z-40 md:relative md:z-auto md:translate-x-0 will-change-transform"
      class:transition-transform={!dragging}
      class:duration-200={!dragging}
      class:ease-out={!dragging}
      style:transform={dragging ? sidebarTransform() : undefined}
      class:-translate-x-full={!drawerOpen && !dragging}
      class:translate-x-0={drawerOpen && !dragging}
    >
      <Sidebar onClose={() => (drawerOpen = false)} />
    </div>

    <!-- Main area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Mobile top bar (hamburger + page title) — hidden on desktop -->
      <div class="flex items-center gap-2 h-12 px-4 border-b border-border shrink-0 md:hidden bg-background">
        <!-- Hamburger with tooltip -->
        <div class="relative group shrink-0">
          <button
            onclick={() => (drawerOpen = !drawerOpen)}
            class="p-1.5 -ml-1.5 rounded-md text-muted-foreground hover:text-foreground
                   hover:bg-accent transition-colors"
            aria-label="Toggle sidebar"
            aria-expanded={drawerOpen}
          >
            <Menu class="w-5 h-5" />
          </button>
          <div
            class="pointer-events-none absolute left-0 top-full mt-2 z-50
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150
                   flex items-center gap-1.5 whitespace-nowrap
                   rounded-md bg-popover text-popover-foreground
                   border border-border shadow-md px-2.5 py-1.5 text-xs"
          >
            Toggle sidebar
            <kbd class="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">⌘\</kbd>
          </div>
        </div>

        <!-- Current page breadcrumb -->
        {#if $currentPageMeta}
          <div class="flex items-center gap-1.5 min-w-0">
            {#if $currentPageMeta.icon}
              <span class="text-base leading-none shrink-0">{$currentPageMeta.icon}</span>
            {/if}
            <span class="truncate text-sm font-medium text-foreground">
              {$currentPageMeta.title || "Untitled"}
            </span>
          </div>
        {:else}
          <span class="text-sm font-medium text-muted-foreground">My workspace</span>
        {/if}
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
