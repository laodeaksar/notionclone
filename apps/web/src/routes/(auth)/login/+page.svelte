<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client.js";
  import { SignInSchema, type SignInInput } from "@notion-clone/schemas";
  import { createForm, Form, Field } from "@formisch/svelte";
  import { Button, Input, Label, Alert } from "@notion-clone/ui";

  let serverError = $state("");

  const loginForm = createForm({ schema: SignInSchema });

  async function onsubmit(output: SignInInput) {
    serverError = "";
    const result = await authClient.signIn.email({
      email: output.email,
      password: output.password,
    });
    if (result.error) {
      serverError = result.error.message ?? "Login failed";
    } else {
      const redirectTo = $page.url.searchParams.get("redirectTo");
      goto(redirectTo ?? "/app");
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-background px-4">
  <div class="w-full max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p class="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
    </div>

    <Form of={loginForm} {onsubmit} class="space-y-4">
      {#if serverError}
        <Alert.Root variant="destructive">{serverError}</Alert.Root>
      {/if}

      <div class="space-y-2">
        <Label.Root for="login-email">Email</Label.Root>
        <Field of={loginForm} path={["email"]}>
          {#snippet children(field)}
            <Input.Root
              {...field.props}
              id="login-email"
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
        <Label.Root for="login-password">Password</Label.Root>
        <Field of={loginForm} path={["password"]}>
          {#snippet children(field)}
            <Input.Root
              {...field.props}
              id="login-password"
              type="password"
              value={field.input ?? ""}
              placeholder="••••••••"
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
        disabled={loginForm.isSubmitting}
        class="w-full"
      >
        {loginForm.isSubmitting ? "Signing in…" : "Sign in"}
      </Button.Root>
    </Form>

    <p class="text-center text-sm text-muted-foreground">
      Don't have an account?
      <a href="/signup" class="font-medium text-primary hover:underline">Sign up</a>
    </p>
  </div>
</div>
