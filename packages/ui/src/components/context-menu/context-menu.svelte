<script lang="ts" module>
  import type { Snippet } from "svelte";

  export interface ContextMenuItem {
    label: string;
    /** Icon name: "pencil" | "file-plus" | "link" | "trash" | "plus" | "copy" | "file" */
    icon?: string;
    shortcut?: string;
    variant?: "default" | "destructive";
    separator?: boolean;
    disabled?: boolean;
    onclick?: () => void;
  }

  export interface ContextMenuProps {
    items: ContextMenuItem[];
    children: Snippet<[{ openAt: (x: number, y: number) => void }]>;
  }
</script>

<script lang="ts">
  import { computePosition, flip, shift } from "@floating-ui/dom";
  import { cn } from "../../utils.js";

  let { items, children }: ContextMenuProps = $props();

  let open = $state(false);
  let rawX = $state(0);
  let rawY = $state(0);

  function openAt(clientX: number, clientY: number) {
    rawX = clientX;
    rawY = clientY;
    open = true;
  }

  function close() { open = false; }

  function onContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openAt(e.clientX, e.clientY);
  }

  function onWindowKeydown(e: KeyboardEvent) {
    if (open && e.key === "Escape") { close(); e.stopPropagation(); }
  }

  function onWindowPointerDown(e: PointerEvent) {
    open = false;
  }

  // Portal to body
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy() { node.remove(); } };
  }

  // Floating action — positions the menu using floating-ui virtual reference
  function floatMenu(node: HTMLDivElement) {
    const virtualEl = {
      getBoundingClientRect() {
        return {
          width: 0, height: 0,
          x: rawX, y: rawY,
          top: rawY, left: rawX,
          right: rawX, bottom: rawY,
        };
      },
    };

    computePosition(virtualEl, node, {
      placement: "bottom-start",
      middleware: [
        flip({ padding: 6 }),
        shift({ padding: 6 }),
      ],
    }).then(({ x, y }) => {
      node.style.left = `${x}px`;
      node.style.top  = `${y}px`;
    });

    return { destroy() {} };
  }

  const ICONS: Record<string, string> = {
    pencil:      `<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>`,
    "file-plus": `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/>`,
    link:        `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
    trash:       `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>`,
    plus:        `<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>`,
    copy:        `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`,
    file:        `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/>`,
  };
</script>

<svelte:window
  onkeydown={onWindowKeydown}
  onpointerdown={onWindowPointerDown}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="display: contents" oncontextmenu={onContextMenu}>
  {@render children({ openAt })}
</div>

{#if open}
  <div
    use:portal
    use:floatMenu
    style="position: fixed; z-index: 9999; top: 0; left: 0;"
    class="min-w-[180px] rounded-xl border border-border bg-popover shadow-xl
           overflow-hidden p-1 animate-in fade-in-0 zoom-in-95 duration-100"
    role="menu"
    aria-orientation="vertical"
  >
    {#each items as item, i (i)}
      {#if item.separator}
        <div class="mx-1 my-1 h-px bg-border" role="separator"></div>
      {/if}
      <button
        type="button"
        role="menuitem"
        disabled={item.disabled}
        onclick={() => { item.onclick?.(); close(); }}
        class={cn(
          "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors text-left",
          item.variant === "destructive"
            ? "text-destructive hover:bg-destructive/10"
            : "text-foreground hover:bg-accent",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        {#if item.icon && ICONS[item.icon]}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-3.5 h-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          >{@html ICONS[item.icon]}</svg>
        {/if}
        <span class="flex-1">{item.label}</span>
        {#if item.shortcut}
          <span class="text-xs text-muted-foreground font-mono">{item.shortcut}</span>
        {/if}
      </button>
    {/each}
  </div>
{/if}
