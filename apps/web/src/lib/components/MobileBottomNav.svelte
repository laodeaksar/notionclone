<script lang="ts">
  import { goto } from "$app/navigation";
  import { Home, Search, FilePlus, Menu } from "lucide-svelte";

  let {
    onOpenMenu,
    onOpenSearch,
    onNewPage,
    onScrollTop,
  }: {
    onOpenMenu: () => void;
    onOpenSearch: () => void;
    onNewPage: () => void;
    onScrollTop?: () => void;
  } = $props();

  // ── Swipe-up gesture — scroll to top ───────────────────────────────────────
  const SWIPE_THRESHOLD = 40;

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
    if (dy < -SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      triggered = true;
      onScrollTop?.();
      setTimeout(() => (triggered = false), 600);
    }
  }
</script>

<nav
  class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden
         flex items-center gap-1 px-2 py-2
         bg-background/80 backdrop-blur-md
         border border-border rounded-2xl
         transition-shadow duration-200
         {triggered ? 'shadow-xl shadow-primary/20' : 'shadow-lg'}"
  aria-label="Mobile navigation"
  ontouchstart={onNavTouchStart}
  ontouchend={onNavTouchEnd}
>
  <button
    onclick={() => goto("/app")}
    class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    aria-label="Home"
  >
    <Home class="w-5 h-5" />
  </button>

  <button
    onclick={onOpenSearch}
    class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    aria-label="Search"
  >
    <Search class="w-5 h-5" />
  </button>

  <button
    onclick={onNewPage}
    class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    aria-label="New page"
  >
    <FilePlus class="w-5 h-5" />
  </button>

  <button
    onclick={onOpenMenu}
    class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    aria-label="Open sidebar"
  >
    <Menu class="w-5 h-5" />
  </button>
</nav>
