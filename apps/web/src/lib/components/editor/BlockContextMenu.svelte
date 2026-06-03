<script lang="ts">
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
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="8" y="8" width="12" height="12" rx="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
      Duplicate block
    </button>
    <button
      onclick={onDelete}
      class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
      Delete block
    </button>
  </div>
{/if}
