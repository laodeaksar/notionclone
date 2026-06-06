<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient, useSession } from "$lib/auth-client.js";
  import { userStore, type User } from "$lib/stores/user.js";
  import { isOnline } from "$lib/stores/network.js";
  import { currentPageMeta } from "$lib/stores/page.js";
  import { currentWorkspaceId } from "$lib/stores/workspace.js";
  import { createPageFn, pagesKey } from "$lib/queries.js";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { breadcrumbStore } from "$lib/stores/breadcrumb.js";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import PageBreadcrumb from "$lib/components/PageBreadcrumb.svelte";
  import CommandPalette from "$lib/components/CommandPalette.svelte";
  import OfflineIndicator from "$lib/components/OfflineIndicator.svelte";
  import MobileBottomNav from "$lib/components/MobileBottomNav.svelte";

  let { children } = $props();
  let paletteOpen = $state(false);
  let drawerOpen = $state(false);
  let mainEl = $state<HTMLElement | null>(null);

  // ── Swipe gesture (trigger only — no live drag animation) ─────────────────
  const EDGE_ZONE = 24;  // px from left edge that starts an open-swipe
  const THRESHOLD = 60;  // px of horizontal travel to commit open/close

  let touchStartX = 0;
  let touchStartY = 0;
  let swipeIsHorizontal = false;

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    swipeIsHorizontal = false;
  }

  function onTouchMove(e: TouchEvent) {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      swipeIsHorizontal = true;
      // Prevent scroll during intentional horizontal swipe
      if ((!drawerOpen && touchStartX <= EDGE_ZONE) || drawerOpen) {
        e.preventDefault();
      }
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (!swipeIsHorizontal) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (!drawerOpen && touchStartX <= EDGE_ZONE && dx >= THRESHOLD) {
      drawerOpen = true;
    } else if (drawerOpen && dx <= -THRESHOLD) {
      drawerOpen = false;
    }
    swipeIsHorizontal = false;
  }

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

  // ── Create page (for mobile bottom nav) ───────────────────────────────────
  const qc = useQueryClient();
  const createPage = createMutation(() => ({
    mutationFn: createPageFn,
    onSuccess: async (newPage) => {
      if ($currentWorkspaceId) {
        await qc.invalidateQueries({ queryKey: pagesKey($currentWorkspaceId) });
      }
      goto(`/app/${newPage.id}`);
    },
  }));

  function handleNewPage() {
    if (!$currentWorkspaceId) return;
    createPage.mutate({ title: "Untitled", workspaceId: $currentWorkspaceId });
  }

  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
      e.preventDefault();
      drawerOpen = !drawerOpen;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "n") {
      e.preventDefault();
      handleNewPage();
    }
    if (e.key === "Escape" && drawerOpen) {
      drawerOpen = false;
    }
  }
</script>

<svelte:head>
  {#if $currentPageMeta}
    <title>{$currentPageMeta.icon ? `${$currentPageMeta.icon} ` : ""}{$currentPageMeta.title || "Untitled"}</title>
  {:else}
    <title>Aksar La'ode</title>
  {/if}
</svelte:head>

<svelte:window
  onkeydown={handleGlobalKeydown}
  ontouchstart={onTouchStart}
  ontouchmove={onTouchMove}
  ontouchend={onTouchEnd}
/>

<div class="flex h-screen overflow-hidden bg-background">
  {#if ready}
    <!-- Mobile: backdrop + centered sidebar panel -->
    {#if drawerOpen}
      <div
        transition:fade={{ duration: 150 }}
        class="fixed inset-0 z-[55] md:hidden bg-black/40"
        role="button"
        tabindex="-1"
        aria-label="Close menu"
        onclick={() => (drawerOpen = false)}
        onkeydown={(e) => e.key === "Escape" && (drawerOpen = false)}
      ></div>
      <div class="fixed inset-0 z-[60] md:hidden flex items-center justify-center pointer-events-none">
        <div
          transition:scale={{ duration: 150, start: 0.95 }}
          class="pointer-events-auto"
        >
          <Sidebar onClose={() => (drawerOpen = false)} />
        </div>
      </div>
    {/if}

    <!-- Desktop: sidebar always in flex flow -->
    <div class="hidden md:block flex-none">
      <Sidebar />
    </div>

    <!-- Main area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Breadcrumb — fixed above scroll, only when a page is open -->
      {#if $breadcrumbStore}
        <PageBreadcrumb
          page={$breadcrumbStore.page}
          pages={$breadcrumbStore.pages}
        />
      {/if}

      <main bind:this={mainEl} class="flex-1 overflow-y-auto pb-24 md:pb-0">
        {@render children()}
      </main>
    </div>

    <!-- Floating bottom nav — mobile only -->
    <MobileBottomNav
      onOpenMenu={() => (drawerOpen = true)}
      onOpenSearch={() => (paletteOpen = true)}
      onNewPage={handleNewPage}
      onScrollTop={() => mainEl?.scrollTo({ top: 0, behavior: "smooth" })}
    />

    <CommandPalette bind:open={paletteOpen} />
  {:else}
    <div class="flex h-full w-full items-center justify-center">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  {/if}
</div>

<OfflineIndicator />
