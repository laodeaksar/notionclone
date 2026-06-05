<script lang="ts">
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { currentWorkspaceId } from "$lib/stores/workspace.js";
  import { workspacesKey, createWorkspaceFn } from "$lib/queries.js";
  import { WorkspaceCreateSchema, type WorkspaceCreateInput } from "@notion-clone/schemas";
  import { createForm, Form, Field } from "@formisch/svelte";
  import { Button, Input, Label, Alert, Dialog } from "@notion-clone/ui";

  let { onclose }: { onclose: () => void } = $props();

  const qc = useQueryClient();

  const createWorkspace = createMutation(() => ({
    mutationFn: createWorkspaceFn,
    onSuccess: (ws) => {
      qc.invalidateQueries({ queryKey: workspacesKey() });
      currentWorkspaceId.set(ws.id);
      onclose();
    },
  }));

  const wsForm = createForm({ schema: WorkspaceCreateSchema });

  async function onsubmit(output: WorkspaceCreateInput) {
    await createWorkspace.mutateAsync({
      name: output.name,
      description: output.description,
    });
  }
</script>

<Dialog.Root onClose={onclose} title="Create Workspace">
  <Form of={wsForm} {onsubmit} class="p-6 space-y-4">
    {#if createWorkspace.isError}
      <Alert.Root variant="destructive">
        {createWorkspace.error?.message ?? "Something went wrong"}
      </Alert.Root>
    {/if}

    <div class="space-y-2">
      <Label.Root for="ws-name">Name</Label.Root>
      <Field of={wsForm} path={["name"]}>
        {#snippet children(field)}
          <Input.Root
            {...field.props}
            id="ws-name"
            type="text"
            value={field.input ?? ""}
            placeholder="My Workspace"
            error={!!field.errors}
          />
          {#if field.errors}
            <p class="mt-1 text-xs text-destructive">{field.errors[0]}</p>
          {/if}
        {/snippet}
      </Field>
    </div>

    <div class="space-y-2">
      <Label.Root for="ws-desc">
        Description <span class="text-muted-foreground font-normal">(optional)</span>
      </Label.Root>
      <Field of={wsForm} path={["description"]}>
        {#snippet children(field)}
          <Input.Root
            {...field.props}
            id="ws-desc"
            type="text"
            value={field.input ?? ""}
            placeholder="What's this workspace for?"
          />
        {/snippet}
      </Field>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <Button.Root type="button" variant="outline" onclick={onclose}>
        Cancel
      </Button.Root>
      <Button.Root type="submit" disabled={createWorkspace.isPending}>
        {createWorkspace.isPending ? "Creating…" : "Create"}
      </Button.Root>
    </div>
  </Form>
</Dialog.Root>
