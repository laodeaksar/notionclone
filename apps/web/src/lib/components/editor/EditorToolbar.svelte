<script lang="ts">
  let {
    saveIsPending = false,
    saveIsError = false,
    versionIsPending = false,
    versionIsSuccess = false,
    onImageUpload,
    onSaveVersion,
    onOpenHistory,
  }: {
    saveIsPending?: boolean;
    saveIsError?: boolean;
    versionIsPending?: boolean;
    versionIsSuccess?: boolean;
    onImageUpload: () => void;
    onSaveVersion: () => void;
    onOpenHistory: () => void;
  } = $props();
</script>

<div class="flex items-center gap-1 mb-4 pb-3 border-b border-border text-muted-foreground">
  <button
    onclick={onImageUpload}
    class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors"
    title="Upload image"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
    Image
  </button>

  <div class="flex-1"></div>

  {#if saveIsPending}
    <span class="text-xs text-muted-foreground flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
      Saving…
    </span>
  {:else if saveIsError}
    <span class="text-xs text-destructive flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
      Save failed
    </span>
  {/if}

  {#if versionIsSuccess}
    <span class="text-xs text-green-600 font-medium px-2">✓ Saved</span>
  {/if}

  <button
    onclick={onSaveVersion}
    disabled={versionIsPending}
    class="px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
  >
    {versionIsPending ? "Saving…" : "Save version"}
  </button>

  <button
    onclick={onOpenHistory}
    class="px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors"
  >
    History
  </button>
</div>
