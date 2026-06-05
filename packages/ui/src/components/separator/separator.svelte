<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    orientation = "horizontal",
    class: className,
    ...rest
  }: SeparatorProps = $props();
</script>

<div
  role="separator"
  aria-orientation={orientation}
  class={cn(
    "shrink-0 bg-border",
    orientation === "vertical" ? "h-full w-px" : "h-px w-full",
    className
  )}
  {...rest}
></div>
