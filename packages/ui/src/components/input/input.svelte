<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  export interface InputProps extends HTMLInputAttributes {
    error?: boolean;
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    class: className,
    error = false,
    ...rest
  }: InputProps = $props();
</script>

<input
  class={cn(
    "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    error ? "border-destructive focus-visible:ring-destructive" : "border-input",
    className
  )}
  {...rest}
/>
