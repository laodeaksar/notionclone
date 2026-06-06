<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Page } from "$lib/stores/page.js";
  import { Home, ChevronRight } from "lucide-svelte";

  let {
    page,
    pages,
  }: {
    page: Page;
    pages: Page[];
  } = $props();

  // Walk parentId chain to build ancestor list (root → ... → parent)
  const ancestors = $derived(() => {
    const map = new Map(pages.map((p) => [p.id, p]));
    const chain: Page[] = [];
    let cur = map.get(page.parentId ?? "");
    while (cur) {
      chain.unshift(cur);
      cur = map.get(cur.parentId ?? "");
    }
    return chain;
  });
</script>

<nav
  class="w-full bg-background/90 backdrop-blur-sm border-b border-border shrink-0"
  aria-label="Breadcrumb"
>
  <div class="max-w-3xl mx-auto px-8 h-9 flex items-center gap-1 text-xs text-muted-foreground">
    <!-- Home -->
    <button
      onclick={() => goto("/app")}
      class="flex items-center p-1 rounded hover:bg-accent hover:text-foreground transition-colors"
      title="Home"
      aria-label="Home"
    >
      <Home class="w-3.5 h-3.5" />
    </button>

    {#each ancestors() as ancestor (ancestor.id)}
      <ChevronRight class="w-3 h-3 shrink-0 opacity-40" />
      <button
        onclick={() => goto(`/app/${ancestor.id}`)}
        class="max-w-[140px] truncate px-1.5 py-0.5 rounded
               hover:bg-accent hover:text-foreground transition-colors"
      >
        {ancestor.title || "Untitled"}
      </button>
    {/each}

    <ChevronRight class="w-3 h-3 shrink-0 opacity-40" />

    <!-- Current page -->
    <span class="max-w-[200px] truncate px-1.5 py-0.5 text-foreground font-medium">
      {page.title || "Untitled"}
    </span>
  </div>
</nav>
