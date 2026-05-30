<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client.js";
  import * as v from "valibot";
  import { SignUpSchema } from "@notion-clone/schemas";

  let name = $state("");
  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";
    loading = true;
    try {
      const parsed = v.parse(SignUpSchema, { name, email, password });
      const result = await authClient.signUp.email({
        name: parsed.name,
        email: parsed.email,
        password: parsed.password,
      });
      if (result.error) {
        error = result.error.message ?? "Sign up failed";
      } else {
        goto("/app");
      }
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

<div class="min-h-screen flex items-center justify-center bg-background px-4">
  <div class="w-full max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">Create an account</h1>
      <p class="mt-2 text-sm text-muted-foreground">Start writing. For free.</p>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4">
      {#if error}
        <div class="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      {/if}

      <div class="space-y-2">
        <label for="name" class="text-sm font-medium">Name</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Your Name"
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-2">
        <label for="password" class="text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Min 8 characters"
          minlength={8}
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      Already have an account?
      <a href="/login" class="font-medium text-primary hover:underline">Sign in</a>
    </p>
  </div>
</div>
