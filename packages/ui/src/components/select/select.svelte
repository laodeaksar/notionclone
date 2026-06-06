<script lang="ts" module>
  import type { Snippet } from "svelte";

  export interface SelectOption {
    value: string;
    label: string;
    description?: string;
  }

  export interface SelectProps {
    options: SelectOption[];
    value?: string | null;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    footer?: Snippet;
    renderItem?: Snippet<[SelectOption, boolean]>;
    class?: string;
  }
</script>

<script lang="ts">
  import {
    computePosition,
    flip,
    shift,
    offset,
    autoUpdate,
    size,
  } from "@floating-ui/dom";
  import { cn } from "../../utils.js";

  let {
    options,
    value = null,
    onValueChange,
    placeholder = "Select…",
    footer,
    renderItem,
    class: className,
  }: SelectProps = $props();

  let open = $state(false);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let posX = $state(0);
  let posY = $state(0);
  let posW = $state(0);

  const selected = $derived(options.find((o) => o.value === value) ?? null);

  function select(opt: SelectOption) {
    onValueChange?.(opt.value);
    open = false;
  }

  // Floating action — mounts on the dropdown div when open
  function floatDropdown(node: HTMLDivElement) {
    if (!triggerEl) return { destroy() {} };

    async function update() {
      const { x, y } = await computePosition(triggerEl!, node, {
        placement: "bottom-start",
        middleware: [
          offset(4),
          flip({ padding: 6 }),
          shift({ padding: 6 }),
          size({
            apply({ rects }) {
              posW = rects.reference.width;
            },
          }),
        ],
      });
      posX = x;
      posY = y;
    }

    const cleanup = autoUpdate(triggerEl, node, update);
    return { destroy: cleanup };
  }

  // Portal to body — escapes any overflow:hidden parents
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy() { node.remove(); } };
  }

  function onWindowKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === "Escape") { open = false; e.stopPropagation(); }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = options.findIndex((o) => o.value === value);
      const next = options[Math.min(idx + 1, options.length - 1)];
      if (next) onValueChange?.(next.value);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = options.findIndex((o) => o.value === value);
      const prev = options[Math.max(idx - 1, 0)];
      if (prev) onValueChange?.(prev.value);
    }
  }

  function onWindowPointerDown(e: PointerEvent) {
    if (!open) return;
    const target = e.target as Node;
    if (triggerEl?.contains(target)) return;
    open = false;
  }
</script>

<svelte:window onkeydown={onWindowKeydown} onpointerdown={onWindowPointerDown} />

<div class={cn("relative w-full", className)}>
  <!-- Trigger -->
  <button
    bind:this={triggerEl}
    type="button"
    onclick={() => (open = !open)}
    aria-haspopup="listbox"
    aria-expanded={open}
    class="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm
           hover:bg-accent transition-colors min-w-0"
  >
    <span class="flex-1 min-w-0 truncate font-semibold">
      {selected?.label ?? placeholder}
    </span>
    <!-- Chevron -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform duration-150
             {open ? 'rotate-180' : ''}"
      aria-hidden="true"
    ><path d="m6 9 6 6 6-6" /></svg>
  </button>
</div>

<!-- Dropdown — portalled to body, positioned by floating-ui -->
{#if open}
  <div
    use:portal
    use:floatDropdown
    role="listbox"
    aria-label="Select option"
    style="position: fixed; top: {posY}px; left: {posX}px; width: {posW}px; z-index: 9999; min-width: 180px;"
    class="rounded-xl border border-border bg-popover shadow-xl overflow-hidden
           animate-in fade-in-0 zoom-in-95 duration-100"
  >
    <div class="max-h-64 overflow-y-auto p-1">
      {#if options.length === 0}
        <p class="px-3 py-4 text-center text-xs text-muted-foreground">No options</p>
      {/if}

      {#each options as opt (opt.value)}
        {@const isSelected = opt.value === value}
        <button
          type="button"
          role="option"
          aria-selected={isSelected}
          onclick={() => select(opt)}
          class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left
                 transition-colors hover:bg-accent
                 {isSelected ? 'text-foreground' : 'text-foreground/80'}"
        >
          {#if renderItem}
            {@render renderItem(opt, isSelected)}
          {:else}
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{opt.label}</p>
              {#if opt.description}
                <p class="text-xs text-muted-foreground truncate">{opt.description}</p>
              {/if}
            </div>
          {/if}

          <!-- Checkmark -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-3.5 h-3.5 shrink-0 text-primary transition-opacity
                   {isSelected ? 'opacity-100' : 'opacity-0'}"
            aria-hidden="true"
          ><polyline points="20 6 9 17 4 12" /></svg>
        </button>
      {/each}
    </div>

    {#if footer}
      <div class="border-t border-border p-1">
        {@render footer()}
      </div>
    {/if}
  </div>
{/if}
