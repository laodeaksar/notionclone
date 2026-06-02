import { writable } from "svelte/store";
import { api } from "$lib/eden.js";

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

function createWorkspaceStore() {
  const { subscribe, set, update } = writable<{
    workspaces: Workspace[];
    current: Workspace | null;
    loading: boolean;
    error: string | null;
  }>({
    workspaces: [],
    current: null,
    loading: false,
    error: null,
  });

  return {
    subscribe,
    async load() {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await api.api.workspaces.$get();
        if (!res.ok) throw new Error(await parseError(res));
        const workspaces = (await res.json()) as Workspace[];
        update((s) => ({ ...s, workspaces, loading: false }));
      } catch (e) {
        update((s) => ({ ...s, error: String(e), loading: false }));
      }
    },
    setCurrent(ws: Workspace | null) {
      update((s) => ({ ...s, current: ws }));
    },
    async create(name: string, description?: string) {
      const res = await api.api.workspaces.$post({ json: { name, description } });
      if (!res.ok) throw new Error(await parseError(res));
      const ws = (await res.json()) as Workspace;
      update((s) => ({ ...s, workspaces: [...s.workspaces, ws], current: ws }));
      return ws;
    },
    async remove(id: string) {
      const res = await api.api.workspaces[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error(await parseError(res));
      update((s) => ({
        ...s,
        workspaces: s.workspaces.filter((w) => w.id !== id),
        current: s.current?.id === id ? null : s.current,
      }));
    },
  };
}

export const workspaceStore = createWorkspaceStore();
