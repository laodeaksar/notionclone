<script lang="ts">
  import { Check, Plus } from "lucide-svelte";
  import type { Workspace } from "$lib/stores/workspace.js";

  let {
    workspaces,
    currentWorkspaceId,
    onSelect,
    onClose,
    onCreateNew,
  }: {
    workspaces: Workspace[];
    currentWorkspaceId: string | null;
    onSelect: (workspace: Workspace) => void;
    onClose: () => void;
    onCreateNew: () => void;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  function trapFocus(node: HTMLElement) {
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    queueMicrotask(() => {
      (node.querySelector<HTMLElement>(selector))?.focus();
    });
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  onclick={(e) => e.target === e.currentTarget && onClose()}
  role="presentation"
>
  <div
    use:trapFocus
    class="w-full max-w-sm rounded-xl bg-background border border-border shadow-2xl overflow-hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Switch workspace"
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-border">
      <p class="text-sm font-semibold text-foreground">Workspaces</p>
      <p class="text-xs text-muted-foreground mt-0.5">Switch between your workspaces</p>
    </div>

    <!-- Workspace list -->
    <div class="max-h-72 overflow-y-auto p-2">
      {#if workspaces.length === 0}
        <p class="px-2 py-4 text-center text-sm text-muted-foreground">No workspaces yet</p>
      {:else}
        {#each workspaces as workspace (workspace.id)}
          <button
            onclick={() => { onSelect(workspace); onClose(); }}
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-accent group"
          >
            <!-- Avatar -->
            <div
              class="w-8 h-8 shrink-0 rounded-md bg-primary/10 flex items-center justify-center text-sm font-bold text-primary select-none"
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>

            <!-- Name + description -->
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-foreground truncate">{workspace.name}</p>
              {#if workspace.description}
                <p class="text-xs text-muted-foreground truncate">{workspace.description}</p>
              {/if}
            </div>

            <!-- Active check -->
            {#if workspace.id === currentWorkspaceId}
              <Check class="w-4 h-4 shrink-0 text-primary" />
            {/if}
          </button>
        {/each}
      {/if}
    </div>

    <!-- Footer: create new -->
    <div class="border-t border-border p-2">
      <button
        onclick={() => { onClose(); onCreateNew(); }}
        class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <div class="w-8 h-8 shrink-0 rounded-md border-2 border-dashed border-border flex items-center justify-center">
          <Plus class="w-4 h-4" />
        </div>
        Create new workspace
      </button>
    </div>
  </div>
</div>
