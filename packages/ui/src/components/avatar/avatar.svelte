<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    fallback: string;
    size?: "sm" | "default" | "lg";
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    fallback,
    size = "default",
    class: className,
    ...rest
  }: AvatarProps = $props();

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    default: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  const initial = $derived(fallback.charAt(0).toUpperCase());
</script>

<div
  class={cn(
    "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
    "bg-primary/10 font-semibold text-primary select-none",
    sizeClasses[size],
    className
  )}
  aria-label={fallback}
  {...rest}
>
  {initial}
</div>
