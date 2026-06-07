<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";
  const inputGroupButtonVariants = tv({
    base: "gap-2 text-sm flex items-center shadow-none",
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm-group-button-size-sm",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  });
  export type InputGroupButtonSize = VariantProps<typeof inputGroupButtonVariants>["size"];
</script>
<script lang="ts">
  import { cn } from "../../utils.js";
  import type { ComponentProps } from "svelte";
  import { Button } from "../button/index.js";
  let {
    ref = $bindable(null),
    class: className,
    children,
    type = "button",
    variant = "ghost",
    size = "xs",
    ...restProps
  }: Omit<ComponentProps<typeof Button>, "href" | "size"> & {
    size?: InputGroupButtonSize;
  } = $props();
</script>
<Button
  bind:ref
  {type}
  data-size={size}
  {variant}
  class={cn(inputGroupButtonVariants({ size }), className)}
  {...restProps}
>
  {@render children?.()}
</Button>
