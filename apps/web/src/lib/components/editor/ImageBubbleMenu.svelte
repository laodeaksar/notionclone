<script lang="ts">
  import {
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    AlignVerticalJustifyCenter,
    Trash2,
  } from "lucide-svelte";

  let {
    visible = false,
    position = null,
    onAlign,
    onDelete,
  }: {
    visible?: boolean;
    position?: { left: number; top: number } | null;
    onAlign: (align: string) => void;
    onDelete: () => void;
  } = $props();

  const alignButtons = [
    { value: "left",       label: "Align left",   Icon: AlignStartVertical },
    { value: "center",     label: "Align center", Icon: AlignCenterVertical },
    { value: "right",      label: "Align right",  Icon: AlignEndVertical },
    { value: "full-width", label: "Full width",   Icon: AlignVerticalJustifyCenter },
  ] as const;
</script>

{#if visible && position}
  <div
    class="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
    style="left:{position.left}px;top:{position.top}px;"
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
