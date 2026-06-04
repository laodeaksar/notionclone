<script lang="ts">
  import { slashMenuStore, type SlashMenuState } from "$lib/editor.js";
  import {
    Heading1, Heading2, Heading3,
    Pilcrow, List, ListOrdered,
    Code2, Quote, Minus,
  } from "lucide-svelte";
  import type { Component } from "svelte";

  let {
    slash,
  }: {
    slash: SlashMenuState;
  } = $props();

  const iconMap: Record<string, Component> = {
    "heading-1": Heading1,
    "heading-2": Heading2,
    "heading-3": Heading3,
    "pilcrow": Pilcrow,
    "list": List,
    "list-ordered": ListOrdered,
    "code-2": Code2,
    "quote": Quote,
    "minus": Minus,
  };

  function execSlash(item: typeof slash.items[number]) {
    slash.executeCommand?.(item);
    slashMenuStore.update((s) => ({ ...s, open: false }));
  }
</script>

{#if slash.open && slash.coords && slash.items.length > 0}
  <div
    class="slash-menu fixed z-50 w-72 rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
    style="left:{slash.coords.left}px;top:{slash.coords.top}px;"
  >
    <div class="px-3 py-2 border-b border-border">
      <p class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Blocks</p>
    </div>
    <div class="max-h-64 overflow-y-auto p-1">
      {#each slash.items as item, i (item.title)}
        {@const Icon = iconMap[item.icon]}
        <button
          onclick={() => execSlash(item)}
          class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-left transition-colors"
          class:bg-accent={i === slash.selectedIndex}
          class:text-accent-foreground={i === slash.selectedIndex}
          class:text-foreground={i !== slash.selectedIndex}
          class:hover:bg-accent={i !== slash.selectedIndex}
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-background text-muted-foreground">
            {#if Icon}
              <svelte:component this={Icon} class="w-4 h-4" strokeWidth={1.75} />
            {/if}
          </div>
          <div class="min-w-0">
            <p class="font-medium leading-tight">{item.title}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{item.description}</p>
          </div>
        </button>
      {/each}
    </div>
    <div class="px-3 py-1.5 border-t border-border">
      <p class="text-[10px] text-muted-foreground">↑↓ navigate · Enter select · Esc close</p>
    </div>
  </div>
{/if}
