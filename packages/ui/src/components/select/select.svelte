<script lang="ts">
import { Select as SelectPrimitive } from "bits-ui";
import type { Snippet } from "svelte";
import { cn } from "../../utils.js";
import { ChevronDown, Check } from "lucide-svelte";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

type Props = {
  open?: boolean;
  value?: string | null | string[];
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  class?: string;
  renderItem?: Snippet<[SelectOption, boolean]>;
  footer?: Snippet;
  children?: Snippet;
  [key: string]: unknown;
};

let {
  open = $bindable(false),
  value = $bindable() as string | null | string[] | undefined,
  options,
  onValueChange,
  placeholder,
  class: className,
  renderItem,
  footer,
  children,
  ...restProps
}: Props = $props();

const isCustom = $derived(options !== undefined);
let dropdownOpen = $state(false);

const stringValue = $derived(
  Array.isArray(value) ? (value[0] ?? null) : (value ?? null)
);

const selectedOption = $derived(
  options?.find((o) => o.value === stringValue)
);

function selectOption(opt: SelectOption) {
  value = opt.value;
  onValueChange?.(opt.value);
  dropdownOpen = false;
}
</script>

{#if isCustom}
  <div class={cn("relative", className)}>
    <button
      type="button"
      onclick={() => (dropdownOpen = !dropdownOpen)}
      class="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      aria-expanded={dropdownOpen}
    >
      {#if selectedOption && renderItem}
        <span class="flex items-center gap-2 min-w-0 flex-1">
          {@render renderItem(selectedOption, true)}
        </span>
      {:else if selectedOption}
        <span class="truncate flex-1 text-left">{selectedOption.label}</span>
      {:else}
        <span class="text-muted-foreground flex-1 text-left">{placeholder ?? "Select…"}</span>
      {/if}
      <ChevronDown class="w-4 h-4 shrink-0 text-muted-foreground" />
    </button>

    {#if dropdownOpen}
      <div
        class="fixed inset-0 z-40"
        onclick={() => (dropdownOpen = false)}
        role="presentation"
      ></div>
      <div
        class="absolute left-0 right-0 z-50 mt-1 rounded-md border border-border bg-popover shadow-lg overflow-hidden"
      >
        <div class="max-h-60 overflow-y-auto p-1">
          {#each options ?? [] as opt (opt.value)}
            {@const isSelected = opt.value === stringValue}
            <button
              type="button"
              onclick={() => selectOption(opt)}
              class="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-left hover:bg-accent transition-colors"
            >
              {#if renderItem}
                {@render renderItem(opt, isSelected)}
                {#if isSelected}
                  <Check class="w-4 h-4 shrink-0 text-primary ml-auto" />
                {/if}
              {:else}
                <span class="flex-1 truncate">{opt.label}</span>
                {#if isSelected}
                  <Check class="w-4 h-4 shrink-0 text-primary" />
                {/if}
              {/if}
            </button>
          {/each}
        </div>
        {#if footer}
          <div class="border-t border-border">
            {@render footer()}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{:else}
  <SelectPrimitive.Root
    bind:open
    bind:value={value as never}
    {...(restProps as any)}
  />
{/if}
