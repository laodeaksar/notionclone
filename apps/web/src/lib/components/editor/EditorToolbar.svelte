<script lang="ts">
  import { ImagePlus, BookmarkPlus, History, MessageSquare, Check, Loader2, AlertCircle, CloudUpload, WifiOff } from "lucide-svelte";
  import { Tooltip } from "@notion-clone/ui";

  let {
    saveIsPending = false,
    saveIsError = false,
    versionIsPending = false,
    versionIsSuccess = false,
    commentPanelOpen = false,
    commentCount = 0,
    hasDraft = false,
    pendingImageCount = 0,
    onImageUpload,
    onSaveVersion,
    onOpenHistory,
    onToggleComments,
    onDiscardDraft,
  }: {
    saveIsPending?: boolean;
    saveIsError?: boolean;
    versionIsPending?: boolean;
    versionIsSuccess?: boolean;
    commentPanelOpen?: boolean;
    commentCount?: number;
    hasDraft?: boolean;
    pendingImageCount?: number;
    onImageUpload: () => void;
    onSaveVersion: () => void;
    onOpenHistory: () => void;
    onToggleComments: () => void;
    onDiscardDraft?: () => void;
  } = $props();
</script>

<div class="flex flex-col gap-2 mb-4">
  {#if pendingImageCount > 0}
    <div class="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-muted-foreground text-xs">
      <WifiOff class="w-3.5 h-3.5 shrink-0" />
      <span>
        {pendingImageCount === 1 ? "1 gambar" : `${pendingImageCount} gambar`}
        akan di-upload saat online kembali
      </span>
    </div>
  {/if}

  <div class="flex items-center gap-1 pb-3 border-b border-border text-muted-foreground">
    <!-- Upload image -->
    <Tooltip.Root content="Upload image" side="bottom">
      <button
        onclick={onImageUpload}
        class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors"
        aria-label="Upload image"
      >
        <ImagePlus class="w-4 h-4" />
      </button>
    </Tooltip.Root>

    <div class="flex-1"></div>

    <!-- Draft indicator -->
    {#if hasDraft && !saveIsPending}
      <Tooltip.Root content="Perubahan tersimpan lokal, menunggu sinkronisasi" side="bottom">
        <span class="flex items-center gap-1 text-xs text-muted-foreground cursor-default">
          <CloudUpload class="w-3.5 h-3.5" />
          Draft tersimpan
        </span>
      </Tooltip.Root>
      {#if onDiscardDraft}
        <Tooltip.Root content="Buang perubahan lokal dan kembalikan ke versi server" side="bottom">
          <button
            onclick={onDiscardDraft}
            class="text-xs text-destructive hover:underline px-1"
          >
            Buang
          </button>
        </Tooltip.Root>
      {/if}
      <span class="w-px h-3 bg-border mx-0.5"></span>
    {/if}

    <!-- Save status -->
    {#if saveIsPending}
      <Tooltip.Root content="Saving…" side="bottom">
        <span aria-label="Saving">
          <Loader2 class="w-3.5 h-3.5 animate-spin text-muted-foreground" />
        </span>
      </Tooltip.Root>
    {:else if saveIsError}
      <Tooltip.Root content="Save failed" side="bottom">
        <span aria-label="Save failed">
          <AlertCircle class="w-3.5 h-3.5 text-destructive" />
        </span>
      </Tooltip.Root>
    {/if}

    {#if versionIsSuccess}
      <Tooltip.Root content="Version saved" side="bottom">
        <span aria-label="Version saved">
          <Check class="w-3.5 h-3.5 text-green-600" />
        </span>
      </Tooltip.Root>
    {/if}

    <!-- Save version -->
    <Tooltip.Root content="Save version" side="bottom">
      <button
        onclick={onSaveVersion}
        disabled={versionIsPending}
        class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
        aria-label="Save version"
      >
        {#if versionIsPending}
          <Loader2 class="w-4 h-4 animate-spin" />
        {:else}
          <BookmarkPlus class="w-4 h-4" />
        {/if}
      </button>
    </Tooltip.Root>

    <!-- Version history -->
    <Tooltip.Root content="Version history" side="bottom">
      <button
        onclick={onOpenHistory}
        class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors"
        aria-label="Version history"
      >
        <History class="w-4 h-4" />
      </button>
    </Tooltip.Root>

    <!-- Toggle comments -->
    <Tooltip.Root content="Toggle comments" shortcut="⌘⇧M" side="bottom">
      <button
        onclick={onToggleComments}
        class="relative p-1.5 rounded-md transition-colors
               {commentPanelOpen
                 ? 'bg-accent text-foreground'
                 : 'hover:bg-accent hover:text-foreground'}"
        aria-label="Toggle comments"
      >
        <MessageSquare class="w-4 h-4" />
        {#if commentCount > 0}
          <span class="absolute -top-1 -right-1 bg-foreground text-background rounded-full min-w-[14px] h-[14px] flex items-center justify-center text-[9px] leading-none font-semibold px-0.5">
            {commentCount}
          </span>
        {/if}
      </button>
    </Tooltip.Root>
  </div>
</div>
