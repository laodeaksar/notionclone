import { writable } from "svelte/store";

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Tracks which workspace is currently selected. Data itself lives in TanStack Query cache.
export const currentWorkspaceId = writable<string | null>(null);
