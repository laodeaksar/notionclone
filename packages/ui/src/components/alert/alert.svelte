<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "destructive";
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    variant = "default",
    class: className,
    children,
    ...rest
  }: AlertProps = $props();

  const variantClasses = {
    default: "bg-background text-foreground border-border",
    destructive:
      "bg-destructive/10 border-destructive/20 text-destructive",
  };
</script>

<div
  role="alert"
  class={cn(
    "relative w-full rounded-md border p-3 text-sm",
    variantClasses[variant],
    className
  )}
  {...rest}
>
  {@render children?.()}
</div>
