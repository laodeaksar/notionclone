<script lang="ts" module>
  import type { HTMLTextareaAttributes } from "svelte/elements";

  export interface TextareaProps extends HTMLTextareaAttributes {
    error?: boolean;
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(),
    error = false,
    ...rest
  }: TextareaProps & { ref?: HTMLTextAreaElement | null } = $props();
</script>

<textarea
  bind:this={ref}
  class={cn(
    "flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    error ? "border-destructive focus-visible:ring-destructive" : "border-input",
    className
  )}
  bind:value
  {...rest}
></textarea>
