<script lang="ts">
  import { ImagePlus, BookmarkPlus, History, MessageSquare, Check, Loader2 } from "lucide-svelte";

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
    class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors"
    title="Upload image"
  >
    <ImagePlus class="w-3.5 h-3.5" />
    Image
  </button>

  <div class="flex-1"></div>

  {#if saveIsPending}
    <span class="text-xs text-muted-foreground flex items-center gap-1.5">
      <Loader2 class="w-3 h-3 animate-spin" />
      Saving…
    </span>
  {:else if saveIsError}
    <span class="text-xs text-destructive flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
      Save failed
    </span>
  {/if}

  {#if versionIsSuccess}
    <span class="text-xs text-green-600 font-medium flex items-center gap-1 px-2">
      <Check class="w-3 h-3" />
      Saved
    </span>
  {/if}

  <button
    onclick={onSaveVersion}
    disabled={versionIsPending}
    class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
  >
    {#if versionIsPending}
      <Loader2 class="w-3.5 h-3.5 animate-spin" />
      Saving…
    {:else}
      <BookmarkPlus class="w-3.5 h-3.5" />
      Save version
    {/if}
  </button>

  <button
    onclick={onOpenHistory}
    class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md hover:bg-accent hover:text-foreground transition-colors"
  >
    <History class="w-3.5 h-3.5" />
    History
  </button>

  <button
    onclick={onToggleComments}
    class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors
           {commentPanelOpen
             ? 'bg-accent text-foreground'
             : 'hover:bg-accent hover:text-foreground'}"
    title="Toggle comments"
  >
    <MessageSquare class="w-3.5 h-3.5" />
    Comments
    {#if commentCount > 0}
      <span class="bg-foreground text-background rounded-full px-1.5 py-0.5 text-[10px] leading-none font-semibold">
        {commentCount}
      </span>
    {/if}
  </button>
</div>
