<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client.js";
  import { SignUpSchema, type SignUpInput } from "@notion-clone/schemas";
  import { createForm, Form, Field } from "@formisch/svelte";
  import { Button, Input, Label, Alert } from "@notion-clone/ui";

  let serverError = $state("");

  const signupForm = createForm({ schema: SignUpSchema });

  async function onsubmit(output: SignUpInput) {
    serverError = "";
    const result = await authClient.signUp.email({
      name: output.name,
      email: output.email,
      password: output.password,
    });
    if (result.error) {
      serverError = result.error.message ?? "Sign up failed";
    } else {
      const redirectTo = $page.url.searchParams.get("redirectTo");
      goto(redirectTo ?? "/app");
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-background px-4">
  <div class="w-full max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">Create an account</h1>
      <p class="mt-2 text-sm text-muted-foreground">Start writing. For free.</p>
    </div>

    <Form of={signupForm} {onsubmit} class="space-y-4">
      {#if serverError}
        <Alert.Root variant="destructive">{serverError}</Alert.Root>
      {/if}

      <div class="space-y-2">
        <Label.Root for="signup-name">Name</Label.Root>
        <Field of={signupForm} path={["name"]}>
          {#snippet children(field)}
            <Input.Root
              {...field.props}
              id="signup-name"
              type="text"
              value={field.input ?? ""}
              placeholder="Your Name"
              error={!!field.errors}
            />
            {#if field.errors}
              <p class="mt-1 text-xs text-destructive">{field.errors[0]}</p>
            {/if}
          {/snippet}
        </Field>
      </div>

      <div class="space-y-2">
        <Label.Root for="signup-email">Email</Label.Root>
        <Field of={signupForm} path={["email"]}>
          {#snippet children(field)}
            <Input.Root
              {...field.props}
              id="signup-email"
              type="email"
              value={field.input ?? ""}
              placeholder="you@example.com"
              error={!!field.errors}
            />
            {#if field.errors}
              <p class="mt-1 text-xs text-destructive">{field.errors[0]}</p>
            {/if}
          {/snippet}
        </Field>
      </div>

      <div class="space-y-2">
        <Label.Root for="signup-password">Password</Label.Root>
        <Field of={signupForm} path={["password"]}>
          {#snippet children(field)}
            <Input.Root
              {...field.props}
              id="signup-password"
              type="password"
              value={field.input ?? ""}
              placeholder="Min 8 characters"
              error={!!field.errors}
            />
            {#if field.errors}
              <p class="mt-1 text-xs text-destructive">{field.errors[0]}</p>
            {/if}
          {/snippet}
        </Field>
      </div>

      <Button.Root
        type="submit"
        disabled={signupForm.isSubmitting}
        class="w-full"
      >
        {signupForm.isSubmitting ? "Creating account…" : "Create account"}
      </Button.Root>
    </Form>

    <p class="text-center text-sm text-muted-foreground">
      Already have an account?
      <a href="/login" class="font-medium text-primary hover:underline">Sign in</a>
    </p>
  </div>
</div>
