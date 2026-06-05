<script lang="ts">
  import { goto } from "$app/navigation";
  import { Home, Search, FilePlus, Menu } from "lucide-svelte";

  let {
    onOpenMenu,
    onOpenSearch,
    onNewPage,
    pageMeta = null,
  }: {
    onOpenMenu: () => void;
    onOpenSearch: () => void;
    onNewPage: () => void;
    pageMeta?: { title: string; icon: string | null } | null;
  } = $props();
</script>

<nav
  class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden
         flex flex-col
         bg-background/80 backdrop-blur-md
         border border-border shadow-lg rounded-2xl
         overflow-hidden"
  aria-label="Mobile navigation"
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
      <span class="truncate">{pageMeta.title || "Untitled"}</span>
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
