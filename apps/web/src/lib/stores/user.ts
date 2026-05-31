import { writable } from "svelte/store";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export const userStore = writable<User | null>(null);
