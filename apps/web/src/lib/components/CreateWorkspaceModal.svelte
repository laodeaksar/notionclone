<script lang="ts">
  import { workspaceStore } from "$lib/stores/workspace.js";
  import { WorkspaceCreateSchema, type WorkspaceCreateInput } from "@notion-clone/schemas";
  import { createForm, Form, Field } from "@formisch/svelte";

  let { onclose }: { onclose: () => void } = $props();

  let serverError = $state("");

  const wsForm = createForm({ schema: WorkspaceCreateSchema });

  async function onsubmit(output: WorkspaceCreateInput) {
    serverError = "";
    try {
      await workspaceStore.create(output.name, output.description);
      onclose();
    } catch (e) {
      serverError = String(e);
    }
  }

  function trapFocus(node: HTMLElement) {
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return Array.from(node.querySelectorAll<HTMLElement>(selector));
    }

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
</script>

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

    <Form of={wsForm} {onsubmit} class="space-y-4">
      {#if serverError}
        <div
          class="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      {/if}

      <div class="space-y-2">
        <label for="ws-name" class="text-sm font-medium">Name</label>
        <Field of={wsForm} path={["name"]}>
          {#snippet children(field)}
            <input
              {...field.props}
              id="ws-name"
              type="text"
              value={field.input ?? ""}
              placeholder="My Workspace"
              class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              class:border-destructive={field.errors}
              class:border-input={!field.errors}
            />
            {#if field.errors}
              <p class="mt-1 text-xs text-destructive">{field.errors[0]}</p>
            {/if}
          {/snippet}
        </Field>
      </div>

      <div class="space-y-2">
        <label for="ws-desc" class="text-sm font-medium">
          Description <span class="text-muted-foreground">(optional)</span>
        </label>
        <Field of={wsForm} path={["description"]}>
          {#snippet children(field)}
            <input
              {...field.props}
              id="ws-desc"
              type="text"
              value={field.input ?? ""}
              placeholder="What's this workspace for?"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          {/snippet}
        </Field>
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
          disabled={wsForm.isSubmitting}
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {wsForm.isSubmitting ? "Creating…" : "Create"}
        </button>
      </div>
    </Form>
  </div>
</div>
