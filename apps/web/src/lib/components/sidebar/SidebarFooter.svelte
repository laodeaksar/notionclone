<script lang="ts">
  import { Sun, Moon, LogOut } from "lucide-svelte";
  import type { User } from "$lib/stores/user.js";
  import { Avatar, Button } from "@notion-clone/ui";

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
      <Avatar.Root fallback={user.name} size="sm" />
      <div class="min-w-0">
        <p class="text-sm font-medium truncate leading-tight">{user.name}</p>
        <p class="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <Button.Root
        variant="ghost"
        size="icon"
        onclick={onToggleTheme}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle theme"
        class="h-7 w-7"
      >
        {#if theme === "dark"}
          <Sun class="w-4 h-4" />
        {:else}
          <Moon class="w-4 h-4" />
        {/if}
      </Button.Root>

      <Button.Root
        variant="ghost"
        size="icon"
        onclick={onLogout}
        title="Sign out"
        aria-label="Sign out"
        class="h-7 w-7"
      >
        <LogOut class="w-4 h-4" />
      </Button.Root>
    </div>
  </div>
{/if}
