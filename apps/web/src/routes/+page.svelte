<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client.js";

  let status = $state<"checking" | "redirecting" | "error">("checking");

  onMount(async () => {
    try {
      const session = await authClient.getSession();
      status = "redirecting";
      if (session.data?.user) {
        goto("/app");
      } else {
        goto("/login");
      }
    } catch {
      status = "error";
      setTimeout(() => goto("/login"), 1500);
    }
  });
</script>

<div class="flex h-screen flex-col items-center justify-center gap-8 bg-background">
  <!-- Logo / wordmark -->
  <div class="flex flex-col items-center gap-3 select-none">
    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-7 w-7 text-primary-foreground"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    </div>
    <span class="text-xl font-bold tracking-tight text-foreground">Notion Clone</span>
  </div>

  <!-- Status indicator -->
  <div class="flex flex-col items-center gap-3">
    {#if status === "checking" || status === "redirecting"}
      <!-- Animated dots -->
      <div class="flex gap-1.5">
        {#each [0, 1, 2] as i}
          <div
            class="h-2 w-2 rounded-full bg-muted-foreground/50"
            style="animation: bounce 1.2s ease-in-out {i * 0.2}s infinite"
          ></div>
        {/each}
      </div>
      <p class="text-xs text-muted-foreground">
        {status === "redirecting" ? "Redirecting…" : "Loading…"}
      </p>
    {:else}
      <p class="text-xs text-muted-foreground">Menghubungkan ke server…</p>
    {/if}
  </div>
</div>

<style>
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1;   }
  }
</style>
