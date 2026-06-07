<script lang="ts">
import { Avatar as AvatarPrimitive } from "bits-ui";
import { cn } from "../../utils.js";
import type { Snippet } from "svelte";
import Fallback from "./avatar-fallback.svelte";

let {
  ref = $bindable(null),
  loadingStatus = $bindable("loading"),
  size = "default",
  fallback,
  class: className,
  children,
  ...restProps
}: AvatarPrimitive.RootProps & {
  size?: "default" | "sm" | "lg";
  fallback?: string;
  children?: Snippet;
} = $props();

const initials = $derived(
  fallback
    ? fallback
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? "")
        .join("")
    : ""
);
</script>

<AvatarPrimitive.Root
  bind:ref
  bind:loadingStatus
  data-slot="avatar"
  data-size={size}
  class={cn(
    "cn-avatar after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten",
    className
  )}
  {...restProps}
>
  {#if fallback !== undefined}
    <Fallback>{initials || "?"}</Fallback>
  {:else}
    {@render children?.()}
  {/if}
</AvatarPrimitive.Root>
