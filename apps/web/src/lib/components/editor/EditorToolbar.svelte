<script lang="ts">
  import { ImagePlus, BookmarkPlus, History, MessageSquare, Check, Loader2, AlertCircle } from "lucide-svelte";

  let {
    saveIsPending = false,
    saveIsError = false,
    versionIsPending = false,
    versionIsSuccess = false,
    commentPanelOpen = false,
    commentCount = 0,
    onImageUpload,
    onSaveVersion,
    onOpenHistory,
    onToggleComments,
  }: {
    saveIsPending?: boolean;
    saveIsError?: boolean;
    versionIsPending?: boolean;
    versionIsSuccess?: boolean;
    commentPanelOpen?: boolean;
    commentCount?: number;
    onImageUpload: () => void;
    onSaveVersion: () => void;
    onOpenHistory: () => void;
    onToggleComments: () => void;
  } = $props();
</script>

<div class="flex items-center gap-1 mb-4 pb-3 border-b border-border text-muted-foreground">
  <button
    onclick={onImageUpload}
    class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors"
    title="Upload image"
    aria-label="Upload image"
  >
    <ImagePlus class="w-4 h-4" />
  </button>

  <div class="flex-1"></div>

  {#if saveIsPending}
    <span title="Saving…" aria-label="Saving">
      <Loader2 class="w-3.5 h-3.5 animate-spin text-muted-foreground" />
    </span>
  {:else if saveIsError}
    <span title="Save failed" aria-label="Save failed">
      <AlertCircle class="w-3.5 h-3.5 text-destructive" />
    </span>
  {/if}

  {#if versionIsSuccess}
    <span title="Version saved" aria-label="Version saved">
      <Check class="w-3.5 h-3.5 text-green-600" />
    </span>
  {/if}

  <button
    onclick={onSaveVersion}
    disabled={versionIsPending}
    class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
    title="Save version"
    aria-label="Save version"
  >
    {#if versionIsPending}
      <Loader2 class="w-4 h-4 animate-spin" />
    {:else}
      <BookmarkPlus class="w-4 h-4" />
    {/if}
  </button>

  <button
    onclick={onOpenHistory}
    class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors"
    title="Version history"
    aria-label="Version history"
  >
    <History class="w-4 h-4" />
  </button>

  <button
    onclick={onToggleComments}
    class="relative p-1.5 rounded-md transition-colors
           {commentPanelOpen
             ? 'bg-accent text-foreground'
             : 'hover:bg-accent hover:text-foreground'}"
    title="Toggle comments"
    aria-label="Toggle comments"
  >
    <MessageSquare class="w-4 h-4" />
    {#if commentCount > 0}
      <span class="absolute -top-1 -right-1 bg-foreground text-background rounded-full min-w-[14px] h-[14px] flex items-center justify-center text-[9px] leading-none font-semibold px-0.5">
        {commentCount}
      </span>
    {/if}
  </button>
</div>
