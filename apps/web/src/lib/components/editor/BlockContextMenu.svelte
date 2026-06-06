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

  // ── Menu items ─────────────────────────────────────────────────────────────

  // Icons kept separate to avoid lucide-svelte ↔ Svelte Component<> type mismatch.
  const icons = [Copy, Trash2] as const;

  const items = [
    {
      label: "Duplicate block",
      action: () => onDuplicate(),
      baseClass: "text-foreground hover:bg-accent",
      activeClass: "bg-accent",
    },
    {
      label: "Delete block",
      action: () => onDelete(),
      baseClass: "text-destructive hover:bg-destructive/10",
      activeClass: "bg-destructive/10",
    },
  ];

  // ── Floating-ui positioning ────────────────────────────────────────────────

  let menuEl = $state<HTMLDivElement | undefined>();
  let posX = $state(0);
  let posY = $state(0);

  $effect(() => {
    if (!open || !menuEl) return;

    const cx = x;
    const cy = y;
    const el = menuEl;

    computePosition({ getBoundingClientRect: () => new DOMRect(cx, cy, 0, 0) }, el, {
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

  // ── Keyboard navigation ────────────────────────────────────────────────────

  let activeIndex = $state(0);

  $effect(() => {
    if (!open || !menuEl) return;
    activeIndex = 0;
    const raf = requestAnimationFrame(() => menuEl?.focus());
    return () => cancelAnimationFrame(raf);
  });

  function handleKeydown(e: KeyboardEvent) {
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        break;
      case "ArrowUp":
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        items[activeIndex]?.action();
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        onClose();
        break;
    }
  }
</script>

{#if open}
  <div
    bind:this={menuEl}
    class="ctx-menu fixed z-50 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-lg outline-none"
    style:top="0"
    style:left="0"
    style:transform="translate({posX}px, {posY}px)"
    style:will-change="transform"
    role="menu"
    tabindex="-1"
    aria-label="Block options"
    onkeydown={handleKeydown}
  >
    {#each items as item, i (item.label)}
      {@const Icon = icons[i]}
      <button
        onclick={item.action}
        onmouseenter={() => (activeIndex = i)}
        class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors {item.baseClass} {i === activeIndex ? item.activeClass : ''}"
        role="menuitem"
        tabindex="-1"
      >
        <Icon class="w-3.5 h-3.5" />
        {item.label}
      </button>
    {/each}

    <div class="px-2.5 pt-1 pb-0.5 border-t border-border mt-1">
      <p class="text-[10px] text-muted-foreground">↑↓ navigate · Enter select · Esc close</p>
    </div>
  </div>
{/if}
