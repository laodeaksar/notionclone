<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client.js";
  import { SignUpSchema, type SignUpInput } from "@notion-clone/schemas";
  import { createForm, Form, Field } from "@formisch/svelte";

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
      goto("/app");
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
        <div
          class="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      {/if}

      <div class="space-y-2">
        <label for="signup-name" class="text-sm font-medium">Name</label>
        <Field of={signupForm} path={["name"]}>
          {#snippet children(field)}
            <input
              {...field.props}
              id="signup-name"
              type="text"
              value={field.input ?? ""}
              placeholder="Your Name"
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
        <label for="signup-email" class="text-sm font-medium">Email</label>
        <Field of={signupForm} path={["email"]}>
          {#snippet children(field)}
            <input
              {...field.props}
              id="signup-email"
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
        <label for="signup-password" class="text-sm font-medium">Password</label>
        <Field of={signupForm} path={["password"]}>
          {#snippet children(field)}
            <input
              {...field.props}
              id="signup-password"
              type="password"
              value={field.input ?? ""}
              placeholder="Min 8 characters"
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
        disabled={signupForm.isSubmitting}
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {signupForm.isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </Form>

    <p class="text-center text-sm text-muted-foreground">
      Already have an account?
      <a href="/login" class="font-medium text-primary hover:underline">Sign in</a>
    </p>
  </div>
</div>
