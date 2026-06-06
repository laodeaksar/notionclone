<script lang="ts">
  import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom";
  import {
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    AlignVerticalJustifyCenter,
    Trash2,
  } from "lucide-svelte";

  let {
    visible = false,
    imageRect = null,
    onAlign,
    onDelete,
  }: {
    visible?: boolean;
    imageRect?: { left: number; top: number; width: number; height: number } | null;
    onAlign: (align: string) => void;
    onDelete: () => void;
  } = $props();

  const alignButtons = [
    { value: "left",       label: "Align left",   Icon: AlignStartVertical },
    { value: "center",     label: "Align center", Icon: AlignCenterVertical },
    { value: "right",      label: "Align right",  Icon: AlignEndVertical },
    { value: "full-width", label: "Full width",   Icon: AlignVerticalJustifyCenter },
  ] as const;

  let menuEl = $state<HTMLDivElement | undefined>();
  let posX = $state(0);
  let posY = $state(0);

  $effect(() => {
    if (!visible || !imageRect || !menuEl) return;

    const r = imageRect;
    const virtualRef = {
      getBoundingClientRect: () =>
        new DOMRect(r.left, r.top, r.width, r.height),
    };

    const el = menuEl;

    async function update() {
      if (!el) return;
      const { x, y } = await computePosition(virtualRef, el, {
        placement: "bottom",
        middleware: [
          offset(8),
          flip({ padding: 8, fallbackPlacements: ["top"] }),
          shift({ padding: 8 }),
        ],
      });
      posX = x;
      posY = y;
    }

    const cleanup = autoUpdate(virtualRef, el, update, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: false,
      layoutShift: false,
    });

    return cleanup;
  });
</script>

{#if visible && imageRect}
  <div
    bind:this={menuEl}
    class="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
  >
    {#each alignButtons as btn (btn.value)}
      <button
        onclick={() => onAlign(btn.value)}
        class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent
               text-muted-foreground hover:text-foreground transition-colors"
        title={btn.label}
        aria-label={btn.label}
      >
        <btn.Icon class="w-3.5 h-3.5" />
      </button>
    {/each}

    <div class="w-px h-5 bg-border mx-0.5"></div>

    <button
      onclick={onDelete}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-destructive/10
             text-muted-foreground hover:text-destructive transition-colors"
      title="Delete image"
      aria-label="Delete image"
    >
      <Trash2 class="w-3.5 h-3.5" />
    </button>
  </div>
{/if}
