<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client.js";
  import * as v from "valibot";
  import { SignInSchema } from "@notion-clone/schemas";

  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";
    loading = true;
    try {
      const parsed = v.parse(SignInSchema, { email, password });
      const result = await authClient.signIn.email({
        email: parsed.email,
        password: parsed.password,
      });
      if (result.error) {
        error = result.error.message ?? "Login failed";
      } else {
        const redirectTo = $page.url.searchParams.get("redirectTo");
        goto(redirectTo ?? "/app");
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
      <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p class="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4">
      {#if error}
        <div class="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      {/if}

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
          placeholder="••••••••"
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      Don't have an account?
      <a href="/signup" class="font-medium text-primary hover:underline">Sign up</a>
    </p>
  </div>
</div>
