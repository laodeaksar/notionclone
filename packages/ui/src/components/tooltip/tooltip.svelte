<script lang="ts" module>
  import type { Snippet } from "svelte";

  export interface TooltipProps {
    content: string;
    side?: "top" | "right" | "bottom" | "left";
    shortcut?: string;
    children?: Snippet;
    class?: string;
  }
</script>

<script lang="ts">
  import {
    computePosition,
    flip,
    shift,
    offset,
    autoUpdate,
    type Placement,
  } from "@floating-ui/dom";
  import { cn } from "../../utils.js";

  let {
    content,
    side = "top",
    shortcut,
    children,
    class: className,
  }: TooltipProps = $props();

  let wrapperEl = $state<HTMLElement | null>(null);
  let floatingEl = $state<HTMLDivElement | null>(null);
  let hovered = $state(false);
  let posX = $state(0);
  let posY = $state(0);
  let ready = $state(false);

  async function updatePosition() {
    if (!wrapperEl || !floatingEl) return;
    const { x, y } = await computePosition(wrapperEl, floatingEl, {
      placement: side as Placement,
      middleware: [offset(8), flip(), shift({ padding: 6 })],
    });
    posX = x;
    posY = y;
    ready = true;
  }

  // Start autoUpdate only while hovered — calls updatePosition immediately on start
  $effect(() => {
    if (!wrapperEl || !floatingEl || !hovered) {
      ready = false;
      return;
    }
    const cleanup = autoUpdate(wrapperEl, floatingEl, updatePosition);
    return cleanup;
  });

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy() { node.remove(); } };
  }
</script>

<!-- Reference wrapper -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={wrapperEl}
  role="none"
  class={cn("inline-flex items-center justify-center", className)}
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
  onfocusin={() => (hovered = true)}
  onfocusout={() => (hovered = false)}
>
  {@render children?.()}
</div>

<!-- Floating tooltip — always portalled to body, shown/hidden via opacity -->
<div
  bind:this={floatingEl}
  use:portal
  role="tooltip"
  style="position: fixed; top: {posY}px; left: {posX}px; z-index: 9999;"
  class={cn(
    "pointer-events-none flex items-center gap-1.5 whitespace-nowrap",
    "rounded-md bg-popover text-popover-foreground border border-border",
    "shadow-md px-2.5 py-1.5 text-xs",
    "transition-opacity duration-150",
    hovered && ready ? "opacity-100 delay-300" : "opacity-0 delay-0"
  )}
>
  {content}
  {#if shortcut}
    <kbd
      class="pointer-events-none inline-flex h-4 select-none items-center
             rounded border border-border bg-muted px-1 font-mono
             text-[10px] text-muted-foreground"
    >
      {shortcut}
    </kbd>
  {/if}
</div>
