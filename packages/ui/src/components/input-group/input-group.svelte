<script lang="ts">
import { cn, type WithElementRef } from "../../utils.js";
import type { HTMLAttributes } from "svelte/elements";
import type { Snippet } from "svelte";

let {
  ref = $bindable(null),
  value = $bindable(""),
  placeholder,
  wrapperClass,
  class: className,
  children,
  leftSection,
  rightSection,
  ...props
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
  value?: string;
  placeholder?: string;
  wrapperClass?: string;
  leftSection?: Snippet;
  rightSection?: Snippet;
} = $props();

const hasSections = $derived(leftSection !== undefined || rightSection !== undefined || placeholder !== undefined);
</script>

<div class={cn("", wrapperClass)}>
  <div
    bind:this={ref}
    data-slot="input-group"
    role="group"
    class={cn(
      "group/input-group border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 relative flex w-full min-w-0 items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
      className
    )}
    {...props}
  >
    {#if hasSections}
      {#if leftSection}
        <span class="pointer-events-none flex items-center pl-2.5 text-muted-foreground">
          {@render leftSection()}
        </span>
      {/if}
      <input
        data-slot="input-group-control"
        bind:value
        {placeholder}
        class="flex-1 min-w-0 bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
      />
      {#if rightSection}
        <span class="flex items-center pr-2.5 text-muted-foreground">
          {@render rightSection()}
        </span>
      {/if}
    {:else}
      {@render children?.()}
    {/if}
  </div>
</div>
