<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client.js";
  import { SignInSchema, type SignInInput } from "@notion-clone/schemas";
  import { createForm, Form, Field } from "@formisch/svelte";

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
        <div
          class="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      {/if}

      <div class="space-y-2">
        <label for="login-email" class="text-sm font-medium">Email</label>
        <Field of={loginForm} path={["email"]}>
          {#snippet children(field)}
            <input
              {...field.props}
              id="login-email"
              type="email"
              value={field.input ?? ""}
              placeholder="you@example.com"
              class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
        <label for="login-password" class="text-sm font-medium">Password</label>
        <Field of={loginForm} path={["password"]}>
          {#snippet children(field)}
            <input
              {...field.props}
              id="login-password"
              type="password"
              value={field.input ?? ""}
              placeholder="••••••••"
              class="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              class:border-destructive={field.errors}
              class:border-input={!field.errors}
            />
            {#if field.errors}
              <p class="mt-1 text-xs text-destructive">{field.errors[0]}</p>
            {/if}
          {/snippet}
        </Field>
      </div>

      <button
        type="submit"
        disabled={loginForm.isSubmitting}
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loginForm.isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </Form>

    <p class="text-center text-sm text-muted-foreground">
      Don't have an account?
      <a href="/signup" class="font-medium text-primary hover:underline">Sign up</a>
    </p>
  </div>
</div>
