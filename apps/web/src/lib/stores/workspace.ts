import { writable, derived } from "svelte/store";
import { api } from "$lib/eden.js";

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
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
        const { data, error } = await api.api.workspaces.get();
        if (error) throw new Error(String(error));
        update((s) => ({ ...s, workspaces: (data as Workspace[]) ?? [], loading: false }));
      } catch (e) {
        update((s) => ({ ...s, error: String(e), loading: false }));
      }
    },
    setCurrent(ws: Workspace | null) {
      update((s) => ({ ...s, current: ws }));
    },
    async create(name: string, description?: string) {
      const { data, error } = await api.api.workspaces.post({ name, description });
      if (error) throw new Error(String(error));
      const ws = data as Workspace;
      update((s) => ({ ...s, workspaces: [...s.workspaces, ws], current: ws }));
      return ws;
    },
    async remove(id: string) {
      await api.api.workspaces({ id }).delete();
      update((s) => ({
        ...s,
        workspaces: s.workspaces.filter((w) => w.id !== id),
        current: s.current?.id === id ? null : s.current,
      }));
    },
  };
}

export const workspaceStore = createWorkspaceStore();
