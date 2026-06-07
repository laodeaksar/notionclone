<script lang="ts">
import { Tooltip as TooltipPrimitive } from "bits-ui";
import type { Snippet } from "svelte";
import TooltipContent from "./tooltip-content.svelte";

type Side = "top" | "bottom" | "left" | "right";

let {
  open = $bindable(false),
  content,
  shortcut,
  side = "top" as Side,
  class: className,
  children,
  ...restProps
}: TooltipPrimitive.RootProps & {
  content?: string;
  shortcut?: string;
  side?: Side;
  class?: string;
  children?: Snippet;
} = $props();
</script>

<TooltipPrimitive.Root bind:open {...restProps}>
  {#if content !== undefined}
    <TooltipPrimitive.Trigger>
      {#snippet child({ props })}
        <span {...props} class={className} style="display:contents">
          {@render children?.()}
        </span>
      {/snippet}
    </TooltipPrimitive.Trigger>
    <TooltipContent {side}>
      {content}{#if shortcut}<span class="ml-1 text-[10px] opacity-60">{shortcut}</span>{/if}
    </TooltipContent>
  {:else}
    {@render children?.()}
  {/if}
</TooltipPrimitive.Root>
