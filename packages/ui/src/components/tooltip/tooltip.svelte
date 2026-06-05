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
  import { cn } from "../../utils.js";

  let {
    content,
    side = "top",
    shortcut,
    children,
    class: className,
  }: TooltipProps = $props();

  const positionClasses: Record<string, string> = {
    top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right:  "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  };
</script>

<div class={cn("relative group inline-flex items-center justify-center", className)}>
  {@render children?.()}

  <div
    role="tooltip"
    class="pointer-events-none absolute {positionClasses[side]} z-50
           flex items-center gap-1.5 whitespace-nowrap
           rounded-md bg-popover text-popover-foreground
           border border-border shadow-md px-2.5 py-1.5 text-xs
           opacity-0 group-hover:opacity-100
           transition-opacity duration-150 delay-300 group-hover:delay-0"
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
</div>
