<script lang="ts">
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
</script>

{#if open}
  <div
    class="ctx-menu fixed z-50 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-lg"
    style="left:{x}px;top:{y}px;"
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
