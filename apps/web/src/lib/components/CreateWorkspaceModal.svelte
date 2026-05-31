<script lang="ts">
  import { workspaceStore } from "$lib/stores/workspace.js";
  import * as v from "valibot";
  import { WorkspaceCreateSchema } from "@notion-clone/schemas";

  let { onclose }: { onclose: () => void } = $props();

  let name = $state("");
  let description = $state("");
  let error = $state("");
  let loading = $state(false);

  // Focus trap action
  function trapFocus(node: HTMLElement) {
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return Array.from(node.querySelectorAll<HTMLElement>(selector));
    }

    // Focus first element on mount
    queueMicrotask(() => getFocusable()[0]?.focus());

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onclose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    node.addEventListener("keydown", handleKeydown);
    return {
      destroy() {
        node.removeEventListener("keydown", handleKeydown);
      },
    };
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";
    loading = true;
    try {
      v.parse(WorkspaceCreateSchema, { name, description: description || undefined });
      await workspaceStore.create(name, description || undefined);
      onclose();
    } catch (e) {
      if (e instanceof v.ValiError) {
        error = e.issues[0]?.message ?? "Validation error";
      } else {
        error = String(e);
      }
    } finally {
      loading = false;
    }
  }
</script>

<!-- Backdrop -->
<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  onclick={(e) => e.target === e.currentTarget && onclose()}
  role="presentation"
>
  <div
    use:trapFocus
    class="w-full max-w-md rounded-lg bg-background border border-border shadow-xl p-6 space-y-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="create-ws-title"
  >
    <h2 id="create-ws-title" class="text-lg font-semibold">Create Workspace</h2>

    <form onsubmit={handleSubmit} class="space-y-4">
      {#if error}
        <div class="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive" role="alert">
          {error}
        </div>
      {/if}

      <div class="space-y-2">
        <label for="ws-name" class="text-sm font-medium">Name</label>
        <input
          id="ws-name"
          type="text"
          bind:value={name}
          placeholder="My Workspace"
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-2">
        <label for="ws-desc" class="text-sm font-medium">
          Description <span class="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="ws-desc"
          type="text"
          bind:value={description}
          placeholder="What's this workspace for?"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          onclick={onclose}
          class="rounded-md px-4 py-2 text-sm border border-border hover:bg-accent transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  </div>
</div>
