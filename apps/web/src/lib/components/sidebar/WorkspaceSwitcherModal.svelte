<script lang="ts">
  import { Check, Plus } from "lucide-svelte";
  import type { Workspace } from "$lib/stores/workspace.js";
  import { Dialog, Avatar, Button } from "@notion-clone/ui";

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
</script>

<Dialog.Root onClose={onClose} maxWidth="max-w-sm">
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
          <Avatar.Root fallback={workspace.name} size="default" class="rounded-md" />

          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-foreground truncate">{workspace.name}</p>
            {#if workspace.description}
              <p class="text-xs text-muted-foreground truncate">{workspace.description}</p>
            {/if}
          </div>

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
</Dialog.Root>
