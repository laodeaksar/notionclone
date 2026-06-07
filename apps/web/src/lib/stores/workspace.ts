import { writable } from "svelte/store";

export type { Workspace } from "@notion-clone/schemas";

// Tracks which workspace is currently selected. Data itself lives in TanStack Query cache.
export const currentWorkspaceId = writable<string | null>(null);
