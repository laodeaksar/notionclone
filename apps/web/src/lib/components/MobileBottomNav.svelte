<script lang="ts">
  import { goto } from "$app/navigation";
  import { Home, Search, FilePlus, Menu, ChevronsUp } from "lucide-svelte";

  let {
    onOpenMenu,
    onOpenSearch,
    onNewPage,
    onScrollTop,
    pageMeta = null,
  }: {
    onOpenMenu: () => void;
    onOpenSearch: () => void;
    onNewPage: () => void;
    onScrollTop?: () => void;
    pageMeta?: { title: string; icon: string | null } | null;
  } = $props();

  // ── Swipe-up gesture ───────────────────────────────────────────────────────
  const SWIPE_THRESHOLD = 40; // minimum px upward to trigger

  let touchStartY = 0;
  let touchStartX = 0;
  let triggered = $state(false);

  function onNavTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    triggered = false;
  }

  function onNavTouchEnd(e: TouchEvent) {
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dx = e.changedTouches[0].clientX - touchStartX;
    // Only fire if swipe is clearly upward and not a horizontal swipe
    if (dy < -SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      triggered = true;
      onScrollTop?.();
      // Brief flash to confirm gesture, then reset
      setTimeout(() => (triggered = false), 600);
    }
  }
</script>

<nav
  class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden
         flex flex-col
         bg-background/80 backdrop-blur-md
         border border-border rounded-2xl
         overflow-hidden transition-shadow duration-200
         {triggered ? 'shadow-xl shadow-primary/20' : 'shadow-lg'}"
  aria-label="Mobile navigation"
  ontouchstart={onNavTouchStart}
  ontouchend={onNavTouchEnd}
>
  <!-- Page title strip — only visible when a page is open -->
  {#if pageMeta}
    <div
      class="flex items-center gap-2 px-4 py-2 border-b border-border/60
             text-sm font-medium text-foreground truncate max-w-[280px]
             animate-in fade-in slide-in-from-bottom-1 duration-200"
    >
      {#if pageMeta.icon}
        <span class="text-base leading-none shrink-0">{pageMeta.icon}</span>
      {/if}
      <span class="truncate flex-1">{pageMeta.title || "Untitled"}</span>

      <!-- Scroll-to-top hint icon -->
      {#if onScrollTop}
        <ChevronsUp
          class="w-3.5 h-3.5 shrink-0 text-muted-foreground/60
                 transition-colors duration-200
                 {triggered ? 'text-primary' : ''}"
        />
      {/if}
    </div>
  {/if}

  <!-- Nav buttons -->
  <div class="flex items-center gap-1 px-2 py-2">
    <button
      onclick={() => goto("/app")}
      class="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl
             text-muted-foreground hover:text-foreground hover:bg-accent
             transition-colors min-w-[56px]"
      aria-label="Home"
    >
      <Home class="w-5 h-5" />
      <span class="text-[10px] font-medium">Home</span>
    </button>

    <button
      onclick={onOpenSearch}
      class="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl
             text-muted-foreground hover:text-foreground hover:bg-accent
             transition-colors min-w-[56px]"
      aria-label="Search"
    >
      <Search class="w-5 h-5" />
      <span class="text-[10px] font-medium">Search</span>
    </button>

    <button
      onclick={onNewPage}
      class="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl
             text-muted-foreground hover:text-foreground hover:bg-accent
             transition-colors min-w-[56px]"
      aria-label="New page"
    >
      <FilePlus class="w-5 h-5" />
      <span class="text-[10px] font-medium">New</span>
    </button>

    <button
      onclick={onOpenMenu}
      class="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl
             text-muted-foreground hover:text-foreground hover:bg-accent
             transition-colors min-w-[56px]"
      aria-label="Open sidebar"
    >
      <Menu class="w-5 h-5" />
      <span class="text-[10px] font-medium">Menu</span>
    </button>
  </div>
</nav>
