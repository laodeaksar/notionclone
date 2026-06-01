import { writable } from "svelte/store";
import { browser } from "$app/environment";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (!browser) return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(getInitialTheme());

  return {
    subscribe,
    toggle() {
      update((current) => {
        const next: Theme = current === "dark" ? "light" : "dark";
        if (browser) {
          localStorage.setItem("theme", next);
          document.documentElement.classList.toggle("dark", next === "dark");
        }
        return next;
      });
    },
    init() {
      if (!browser) return;
      const theme = getInitialTheme();
      set(theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    },
  };
}

export const themeStore = createThemeStore();
