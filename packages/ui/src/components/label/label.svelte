<script lang="ts" module>
  import type { HTMLLabelAttributes } from "svelte/elements";

  export interface LabelProps extends HTMLLabelAttributes {}
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    class: className,
    children,
    ...rest
  }: LabelProps = $props();
</script>

<label
  class={cn(
    "text-sm font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className
  )}
  {...rest}
>
  {@render children?.()}
</label>
