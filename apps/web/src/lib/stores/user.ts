import { writable } from "svelte/store";
import { browser } from "$app/environment";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

const STORAGE_KEY = "notion-clone:user";

function createUserStore() {
  let initial: User | null = null;
  if (browser) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) initial = JSON.parse(saved) as User;
    } catch {}
  }

  const { subscribe, set } = writable<User | null>(initial);

  return {
    subscribe,
    set(user: User | null) {
      if (browser) {
        if (user) {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
        } else {
          try { localStorage.removeItem(STORAGE_KEY); } catch {}
        }
      }
      set(user);
    },
  };
}

export const userStore = createUserStore();
