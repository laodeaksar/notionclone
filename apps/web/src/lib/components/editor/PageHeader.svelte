<script lang="ts">
  import type { Page } from "$lib/stores/page.js";

  let {
    page,
    titleValue,
    onTitleInput,
  }: {
    page: Page;
    titleValue: string;
    onTitleInput: (val: string) => void;
  } = $props();
</script>

{#if page.coverImage}
  <div class="relative -mx-8 h-52 overflow-hidden mb-8">
    <img src={page.coverImage} alt="Cover" class="w-full h-full object-cover" />
  </div>
{/if}

{#if page.icon}
  <div class="text-5xl mb-4 leading-none select-none">{page.icon}</div>
{/if}

<input
  type="text"
  value={titleValue}
  oninput={(e) => onTitleInput((e.target as HTMLInputElement).value)}
  placeholder="Untitled"
  class="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground mb-6"
/>
