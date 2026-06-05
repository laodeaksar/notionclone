<script lang="ts">
  import { Sun, Moon, LogOut } from "lucide-svelte";
  import type { User } from "$lib/stores/user.js";
  import { Avatar, Button, Switch, Tooltip } from "@notion-clone/ui";

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
    <!-- User info -->
    <div class="min-w-0 flex items-center gap-2">
      <Avatar.Root fallback={user.name} size="sm" />
      <div class="min-w-0">
        <p class="text-sm font-medium truncate leading-tight">{user.name}</p>
        <p class="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <!-- Dark mode switch -->
      <Tooltip.Root
        content={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        side="top"
      >
        <div class="flex items-center gap-1.5">
          {#if theme === "dark"}
            <Moon class="w-3.5 h-3.5 text-muted-foreground" />
          {:else}
            <Sun class="w-3.5 h-3.5 text-muted-foreground" />
          {/if}
          <Switch.Root
            checked={theme === "dark"}
            onCheckedChange={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          />
        </div>
      </Tooltip.Root>

      <!-- Logout -->
      <Tooltip.Root content="Sign out" side="top">
        <Button.Root
          variant="ghost"
          size="icon"
          onclick={onLogout}
          aria-label="Sign out"
          class="h-7 w-7"
        >
          <LogOut class="w-4 h-4" />
        </Button.Root>
      </Tooltip.Root>
    </div>
  </div>
{/if}
