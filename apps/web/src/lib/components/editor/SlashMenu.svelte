<script lang="ts">
  import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom";
  import { slashMenuStore, type SlashMenuState } from "$lib/editor.js";
  import {
    Heading1, Heading2, Heading3,
    Pilcrow, List, ListOrdered,
    Code2, Quote, Minus,
    Lightbulb, Info, AlertTriangle, CheckCircle,
    ImageIcon,
  } from "lucide-svelte";
  import type { Component } from "svelte";

  let {
    slash,
  }: {
    slash: SlashMenuState;
  } = $props();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconMap: Record<string, Component<any>> = {
    "heading-1": Heading1,
    "heading-2": Heading2,
    "heading-3": Heading3,
    "pilcrow": Pilcrow,
    "list": List,
    "list-ordered": ListOrdered,
    "code-2": Code2,
    "quote": Quote,
    "minus": Minus,
    "image": ImageIcon,
    "lightbulb": Lightbulb,
    "info": Info,
    "alert-triangle": AlertTriangle,
    "check-circle": CheckCircle,
  };

  function execSlash(item: typeof slash.items[number]) {
    slash.executeCommand?.(item);
    slashMenuStore.update((s) => ({ ...s, open: false }));
  }

  let menuEl: HTMLDivElement | undefined = $state();
  let posX = $state(0);
  let posY = $state(0);

  $effect(() => {
    const isOpen = slash.open;
    const hasItems = slash.items.length > 0;
    const rect = slash.rect;
    const ctx = slash.contextElement;

    if (!isOpen || !hasItems || !rect || !menuEl) return;

    const virtualRef = {
      getBoundingClientRect: (): DOMRect => rect() ?? new DOMRect(0, 0, 0, 0),
      ...(ctx ? { contextElement: ctx } : {}),
    };

    async function updatePos() {
      if (!menuEl) return;
      const { x, y } = await computePosition(virtualRef, menuEl, {
        placement: "bottom-start",
        middleware: [
          offset(6),
          flip({ padding: 8, fallbackPlacements: ["top-start"] }),
          shift({ padding: 8, crossAxis: true }),
        ],
      });
      posX = x;
      posY = y;
    }

    const cleanup = autoUpdate(virtualRef, menuEl, updatePos, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: false,
      layoutShift: false,
    });

    return cleanup;
  });
</script>

{#if slash.open && slash.items.length > 0}
  <div
    bind:this={menuEl}
    class="slash-menu fixed z-[300] w-72 rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
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
              <Icon class="w-4 h-4" strokeWidth={1.75} />
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium leading-tight">{item.title}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{item.description}</p>
          </div>
          {#if item.shortcut}
            <kbd class="shrink-0 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5 leading-none">
              {item.shortcut}
            </kbd>
          {/if}
        </button>
      {/each}
    </div>
    <div class="px-3 py-1.5 border-t border-border">
      <p class="text-[10px] text-muted-foreground">↑↓ navigate · Enter select · Esc close</p>
    </div>
  </div>
{/if}
