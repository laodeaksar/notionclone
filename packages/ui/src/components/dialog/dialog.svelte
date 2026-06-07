<script lang="ts">
import { Dialog as DialogPrimitive } from "bits-ui";
import type { Snippet } from "svelte";
import DialogOverlay from "./dialog-overlay.svelte";
import DialogContent from "./dialog-content.svelte";
import { cn } from "../../utils.js";

let {
  open = $bindable(false),
  onClose,
  title,
  maxWidth,
  children,
  ...restProps
}: DialogPrimitive.RootProps & {
  onClose?: () => void;
  title?: string;
  maxWidth?: string;
  children?: Snippet;
} = $props();

const isModal = $derived(onClose !== undefined);
let modalOpen = $state(true);

function handleOpenChange(newOpen: boolean) {
  if (!newOpen) {
    modalOpen = false;
    onClose?.();
  }
}
</script>

{#if isModal}
  <DialogPrimitive.Root open={modalOpen} onOpenChange={handleOpenChange} {...restProps}>
    <DialogOverlay />
    <DialogContent
      showCloseButton={true}
      class={cn("max-w-lg w-full", maxWidth)}
    >
      {#if title}
        <div class="px-6 pt-6 pb-2">
          <h2 class="text-lg font-semibold leading-tight">{title}</h2>
        </div>
      {/if}
      {@render children?.()}
    </DialogContent>
  </DialogPrimitive.Root>
{:else}
  <DialogPrimitive.Root bind:open {...restProps}>
    {@render children?.()}
  </DialogPrimitive.Root>
{/if}
