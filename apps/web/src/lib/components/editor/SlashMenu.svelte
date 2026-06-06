<script lang="ts">
  import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom";
  import { slashMenuStore, type SlashMenuState } from "$lib/editor.js";
  import {
    Heading1, Heading2, Heading3,
    Pilcrow, List, ListOrdered,
    Code2, Quote, Minus,
    Lightbulb, Info, AlertTriangle, CheckCircle,
    ImageIcon, Link,
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
    "image-link": Link,
    "lightbulb": Lightbulb,
    "info": Info,
    "alert-triangle": AlertTriangle,
    "check-circle": CheckCircle,
  };

  function execSlash(item: typeof slash.items[number]) {
    slash.executeCommand?.(item);
    if (item.inputMode !== "url") {
      slashMenuStore.update((s) => ({ ...s, open: false }));
    }
  }

  let menuEl: HTMLDivElement | undefined = $state();
  let posX = $state(0);
  let posY = $state(0);

  let urlValue = $state("");
  let urlInputEl = $state<HTMLInputElement | null>(null);

  $effect(() => {
    if (slash.urlInputMode && urlInputEl) {
      urlValue = "";
      setTimeout(() => urlInputEl?.focus(), 10);
    }
  });

  function submitUrl() {
    slash.onUrlSubmit?.(urlValue);
    urlValue = "";
  }

  function cancelUrl() {
    urlValue = "";
    slashMenuStore.update((s) => ({ ...s, open: false, urlInputMode: false, onUrlSubmit: null }));
  }

  function handleUrlKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); submitUrl(); }
    if (e.key === "Escape") { e.preventDefault(); cancelUrl(); }
  }

  const isVisible = $derived(slash.open && (slash.items.length > 0 || slash.urlInputMode));

  $effect(() => {
    const open = slash.open;
    const visible = open && (slash.items.length > 0 || slash.urlInputMode);
    const rect = slash.rect;
    const ctx = slash.contextElement;

    if (!visible || !rect || !menuEl) return;

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

{#if isVisible}
  <div
    bind:this={menuEl}
    class="slash-menu fixed z-[300] w-72 rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
  >
    {#if slash.urlInputMode}
      <!-- URL input mode -->
      <div class="px-3 py-2 border-b border-border flex items-center gap-2">
        <ImageIcon class="w-3.5 h-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <p class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Image from URL</p>
      </div>
      <div class="p-3 flex flex-col gap-2">
        <div class="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-ring">
          <Link class="w-3.5 h-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
          <input
            bind:this={urlInputEl}
            bind:value={urlValue}
            onkeydown={handleUrlKeydown}
            type="url"
            placeholder="https://example.com/image.png"
            class="flex-1 min-w-0 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div class="flex gap-2">
          <button
            onclick={cancelUrl}
            class="flex-1 px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onclick={submitUrl}
            disabled={!urlValue.trim()}
            class="flex-1 px-3 py-1.5 text-xs rounded-md bg-foreground text-background font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Embed
          </button>
        </div>
      </div>
      <div class="px-3 py-1.5 border-t border-border">
        <p class="text-[10px] text-muted-foreground">Enter to embed · Esc cancel</p>
      </div>
    {:else}
      <!-- Normal items list -->
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
    {/if}
  </div>
{/if}
