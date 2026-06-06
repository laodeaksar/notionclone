<script lang="ts">
  import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom";
  import { Trash2, Link, Check, X } from "lucide-svelte";

  let {
    visible = false,
    videoRect = null,
    onDelete,
    onReplace,
  }: {
    visible?: boolean;
    videoRect?: { left: number; top: number; width: number; height: number } | null;
    onDelete: () => void;
    onReplace: (url: string) => void;
  } = $props();

  let menuEl = $state<HTMLDivElement | undefined>();
  let posX = $state(0);
  let posY = $state(0);

  let replaceMode = $state(false);
  let urlValue = $state("");
  let urlInputEl = $state<HTMLInputElement | null>(null);

  function openReplace() {
    replaceMode = true;
    urlValue = "";
    setTimeout(() => urlInputEl?.focus(), 10);
  }

  function submitReplace() {
    const trimmed = urlValue.trim();
    if (trimmed) onReplace(trimmed);
    replaceMode = false;
    urlValue = "";
  }

  function cancelReplace() {
    replaceMode = false;
    urlValue = "";
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); submitReplace(); }
    if (e.key === "Escape") { e.preventDefault(); cancelReplace(); }
  }

  $effect(() => {
    if (!visible || !videoRect || !menuEl) return;

    const r = videoRect;
    const virtualRef = {
      getBoundingClientRect: () => new DOMRect(r.left, r.top, r.width, r.height),
    };

    const el = menuEl;

    async function update() {
      if (!el) return;
      const { x, y } = await computePosition(virtualRef, el, {
        placement: "top",
        middleware: [
          offset(8),
          flip({ padding: 8, fallbackPlacements: ["bottom"] }),
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

{#if visible && videoRect}
  <div
    bind:this={menuEl}
    class="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
    onmousedown={(e) => e.preventDefault()}
  >
    {#if replaceMode}
      <div class="flex items-center gap-1.5 px-1.5">
        <Link class="w-3.5 h-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
        <input
          bind:this={urlInputEl}
          bind:value={urlValue}
          onkeydown={handleKeydown}
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          class="w-52 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
        <button
          onclick={submitReplace}
          disabled={!urlValue.trim()}
          class="flex items-center justify-center w-6 h-6 rounded text-muted-foreground
                 hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
          title="Replace"
        >
          <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
        <button
          onclick={cancelReplace}
          class="flex items-center justify-center w-6 h-6 rounded text-muted-foreground
                 hover:text-foreground hover:bg-accent transition-colors"
          title="Cancel"
        >
          <X class="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    {:else}
      <button
        onclick={openReplace}
        class="flex items-center gap-1.5 h-7 px-2 rounded text-muted-foreground
               hover:text-foreground hover:bg-accent transition-colors text-xs font-medium"
        title="Replace video URL"
      >
        <Link class="w-3.5 h-3.5" strokeWidth={2} />
        Replace URL
      </button>

      <div class="w-px h-5 bg-border mx-0.5"></div>

      <button
        onclick={onDelete}
        class="flex items-center justify-center w-8 h-7 rounded hover:bg-destructive/10
               text-muted-foreground hover:text-destructive transition-colors"
        title="Delete video"
        aria-label="Delete video"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    {/if}
  </div>
{/if}
