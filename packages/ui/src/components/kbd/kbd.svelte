<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  export interface KbdProps extends HTMLAttributes<HTMLElement> {}
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    class: className,
    children,
    ...rest
  }: KbdProps = $props();
</script>

<kbd
  class={cn(
    "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border",
    "bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground",
    className
  )}
  {...rest}
>
  {@render children?.()}
</kbd>
