<script lang="ts">
  import type { Page } from "$lib/stores/page.js";
  import { FileText } from "lucide-svelte";

  let {
    page,
    titleValue,
    onTitleInput,
  }: {
    page: Page;
    titleValue: string;
    onTitleInput: (val: string) => void;
  } = $props();

  let inputEl = $state<HTMLInputElement | null>(null);

  export function focusTitle() {
    inputEl?.focus();
    inputEl?.select();
  }
</script>

{#if page.coverImage}
  <div class="relative -mx-8 h-52 overflow-hidden mb-8">
    <img src={page.coverImage} alt="Cover" class="w-full h-full object-cover" />
  </div>
{/if}

<div class="mb-4">
  <FileText class="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
</div>

<input
  bind:this={inputEl}
  type="text"
  value={titleValue}
  oninput={(e) => onTitleInput((e.target as HTMLInputElement).value)}
  placeholder="Untitled"
  class="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground mb-6"
/>
