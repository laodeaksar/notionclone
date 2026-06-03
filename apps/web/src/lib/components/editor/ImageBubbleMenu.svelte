<script lang="ts">
  let {
    visible = false,
    position = null,
    onAlign,
  }: {
    visible?: boolean;
    position?: { left: number; top: number } | null;
    onAlign: (align: string) => void;
  } = $props();
</script>

{#if visible && position}
  <div
    class="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
    style="left:{position.left}px;top:{position.top}px;"
  >
    <button
      onclick={() => onAlign("left")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title="Align left"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="3" y1="12" x2="15" y2="12"/>
        <line x1="3" y1="18" x2="18" y2="18"/>
      </svg>
    </button>
    <button
      onclick={() => onAlign("center")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title="Align center"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="6" y1="12" x2="18" y2="12"/>
        <line x1="4" y1="18" x2="20" y2="18"/>
      </svg>
    </button>
    <button
      onclick={() => onAlign("right")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title="Align right"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="9" y1="12" x2="21" y2="12"/>
        <line x1="6" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <div class="w-px h-5 bg-border mx-0.5"></div>
    <button
      onclick={() => onAlign("full-width")}
      class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title="Full width"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="15 3 21 3 21 9"/>
        <polyline points="9 21 3 21 3 15"/>
        <line x1="21" y1="3" x2="14" y2="10"/>
        <line x1="3"  y1="21" x2="10" y2="14"/>
      </svg>
    </button>
  </div>
{/if}
