<script lang="ts" module>
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  export interface InputGroupProps extends HTMLInputAttributes {
    leftSection?: Snippet;
    rightSection?: Snippet;
    error?: boolean;
    wrapperClass?: string;
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    leftSection,
    rightSection,
    error = false,
    class: className,
    wrapperClass,
    ...rest
  }: InputGroupProps = $props();
</script>

<div class={cn("relative flex w-full items-center", wrapperClass)}>
  {#if leftSection}
    <div class="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
      {@render leftSection()}
    </div>
  {/if}

  <input
    class={cn(
      "flex h-9 w-full rounded-md border bg-transparent py-1 text-sm shadow-sm transition-colors",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      leftSection ? "pl-9" : "px-3",
      rightSection ? "pr-9" : leftSection ? "pr-3" : "",
      !leftSection && !rightSection ? "" : "",
      error ? "border-destructive focus-visible:ring-destructive" : "border-input",
      className
    )}
    {...rest}
  />

  {#if rightSection}
    <div class="absolute right-3 flex items-center text-muted-foreground">
      {@render rightSection()}
    </div>
  {/if}
</div>
