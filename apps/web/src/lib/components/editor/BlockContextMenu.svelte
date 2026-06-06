<script lang="ts">
  import { computePosition, flip, shift, offset } from "@floating-ui/dom";
  import { Copy, Trash2 } from "lucide-svelte";

  let {
    open = false,
    x = 0,
    y = 0,
    onClose,
    onDuplicate,
    onDelete,
  }: {
    open?: boolean;
    x?: number;
    y?: number;
    onClose: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
  } = $props();

  let menuEl = $state<HTMLDivElement | undefined>();
  let posX = $state(0);
  let posY = $state(0);

  $effect(() => {
    if (!open || !menuEl) return;

    const cx = x;
    const cy = y;
    const el = menuEl;

    const virtualRef = {
      getBoundingClientRect: () => new DOMRect(cx, cy, 0, 0),
    };

    computePosition(virtualRef, el, {
      placement: "bottom-start",
      middleware: [
        offset(4),
        flip({ padding: 8, fallbackPlacements: ["top-start", "bottom-end", "top-end"] }),
        shift({ padding: 8 }),
      ],
    }).then(({ x: px, y: py }) => {
      posX = px;
      posY = py;
    });
  });
</script>

{#if open}
  <div
    bind:this={menuEl}
    class="ctx-menu fixed z-50 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-lg"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
  >
    <button
      onclick={onDuplicate}
      class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground hover:bg-accent transition-colors"
    >
      <Copy class="w-3.5 h-3.5" />
      Duplicate block
    </button>
    <button
      onclick={onDelete}
      class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
    >
      <Trash2 class="w-3.5 h-3.5" />
      Delete block
    </button>
  </div>
{/if}
