import { writable } from "svelte/store";
import { api } from "$lib/eden.js";

export interface Page {
  id: string;
  title: string;
  icon: string | null;
  coverImage: string | null;
  workspaceId: string;
  parentId: string | null;
  createdBy: string;
  order: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageTree extends Page {
  children: PageTree[];
}

function buildTree(pages: Page[]): PageTree[] {
  const map = new Map<string, PageTree>();
  const roots: PageTree[] = [];
  for (const p of pages) map.set(p.id, { ...p, children: [] });
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function createPageStore() {
  const { subscribe, set, update } = writable<{
    pages: Page[];
    tree: PageTree[];
    current: Page | null;
    loading: boolean;
    error: string | null;
  }>({
    pages: [],
    tree: [],
    current: null,
    loading: false,
    error: null,
  });

  return {
    subscribe,
    async load(workspaceId: string) {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const { data, error } = await api.api.pages.get({
          query: { workspaceId },
        });
        if (error) throw new Error(String(error));
        const pages = (data as unknown as Page[]) ?? [];
        update((s) => ({ ...s, pages, tree: buildTree(pages), loading: false }));
      } catch (e) {
        update((s) => ({ ...s, error: String(e), loading: false }));
      }
    },
    async create(input: { title: string; workspaceId: string; parentId?: string }) {
      const { data, error } = await api.api.pages.post(input);
      if (error) throw new Error(String(error));
      const page = data as unknown as Page;
      update((s) => {
        const pages = [...s.pages, page];
        return { ...s, pages, tree: buildTree(pages), current: page };
      });
      return page;
    },
    async updatePage(id: string, input: { title?: string; icon?: string; coverImage?: string }) {
      const { data, error } = await api.api.pages({ id }).patch(input);
      if (error) throw new Error(String(error));
      const updated = data as unknown as Page;
      update((s) => {
        const pages = s.pages.map((p) => (p.id === id ? updated : p));
        return {
          ...s,
          pages,
          tree: buildTree(pages),
          current: s.current?.id === id ? updated : s.current,
        };
      });
      return updated;
    },
    async removePage(id: string) {
      await api.api.pages({ id }).delete();
      update((s) => {
        const pages = s.pages.filter((p) => p.id !== id);
        return {
          ...s,
          pages,
          tree: buildTree(pages),
          current: s.current?.id === id ? null : s.current,
        };
      });
    },
    setCurrent(page: Page | null) {
      update((s) => ({ ...s, current: page }));
    },
    reset() {
      set({ pages: [], tree: [], current: null, loading: false, error: null });
    },
  };
}

export const pageStore = createPageStore();
