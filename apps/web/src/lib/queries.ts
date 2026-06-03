import { api } from "$lib/eden.js";
import type { Page } from "$lib/stores/page.js";
import type { Workspace } from "$lib/stores/workspace.js";

export const pagesQueryKey = (workspaceId: string) =>
  ["pages", workspaceId] as const;

export const workspacesQueryKey = ["workspaces"] as const;

export function pagesQueryOptions(workspaceId: string) {
  return {
    queryKey: pagesQueryKey(workspaceId),
    queryFn: async (): Promise<Page[]> => {
      const res = await api.api.pages.$get({ query: { workspaceId } });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return res.json() as Promise<Page[]>;
    },
    enabled: workspaceId.length > 0,
    staleTime: 30_000,
  };
}

export function workspacesQueryOptions() {
  return {
    queryKey: workspacesQueryKey,
    queryFn: async (): Promise<Workspace[]> => {
      const res = await api.api.workspaces.$get();
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return res.json() as Promise<Workspace[]>;
    },
    staleTime: 60_000,
  };
}
