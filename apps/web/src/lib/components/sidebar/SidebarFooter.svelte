<script lang="ts">
  import { Sun, Moon, LogOut } from "lucide-svelte";
  import type { User } from "$lib/stores/user.js";

  let {
    user,
    theme,
    onToggleTheme,
    onLogout,
  }: {
    user: User | null;
    theme: "light" | "dark";
    onToggleTheme: () => void;
    onLogout: () => void;
  } = $props();
</script>

{#if user}
  <div class="border-t border-border px-3 py-2 flex items-center justify-between gap-2">
    <div class="min-w-0 flex items-center gap-2">
      <div
        class="w-6 h-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary select-none"
      >
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div class="min-w-0">
        <p class="text-sm font-medium truncate leading-tight">{user.name}</p>
        <p class="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <button
        onclick={onToggleTheme}
        class="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle theme"
      >
        {#if theme === "dark"}
          <Sun class="w-4 h-4" />
        {:else}
          <Moon class="w-4 h-4" />
        {/if}
      </button>
      <button
        onclick={onLogout}
        class="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
        title="Sign out"
        aria-label="Sign out"
      >
        <LogOut class="w-4 h-4" />
      </button>
    </div>
  </div>
{/if}
