<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
import type { Snippet } from "svelte";

interface MenuItem {
  label: string;
  icon?: string;
  onclick: () => void;
  separator?: boolean;
  variant?: "default" | "destructive";
}

let {
  open = $bindable(false),
  items,
  children,
  ...restProps
}: {
  open?: boolean;
  items?: MenuItem[];
  children?: Snippet<[{ openAt: (x: number, y: number) => void }]>;
} & Omit<ContextMenuPrimitive.RootProps, "children"> = $props();

let menuOpen = $state(false);
let menuX = $state(0);
let menuY = $state(0);

function openAt(x: number, y: number) {
  menuX = x;
  menuY = y;
  menuOpen = true;
}

function close() {
  menuOpen = false;
}

const isCustom = $derived(items !== undefined);
</script>

{#if isCustom}
  {@render children?.({ openAt })}

  {#if menuOpen}
    <div
      class="fixed inset-0 z-40"
      onclick={close}
      oncontextmenu={(e) => { e.preventDefault(); close(); }}
      role="presentation"
    ></div>
    <div
      class="fixed z-50 min-w-40 rounded-md border border-border bg-popover shadow-lg py-1 overflow-hidden"
      style:left="{menuX}px"
      style:top="{menuY}px"
      role="menu"
    >
      {#each items ?? [] as item}
        {#if item.separator}
          <hr class="my-1 border-border" />
        {/if}
        <button
          role="menuitem"
          onclick={() => { item.onclick(); close(); }}
          class="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent transition-colors {item.variant === 'destructive' ? 'text-destructive' : 'text-foreground'}"
        >
          {item.label}
        </button>
      {/each}
    </div>
  {/if}
{:else}
  <ContextMenuPrimitive.Root bind:open {...restProps}>
    {@render (children as Snippet | undefined)?.()}
  </ContextMenuPrimitive.Root>
{/if}
