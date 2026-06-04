import { writable } from "svelte/store";

// Holds the title + icon of whichever page is currently open.
// Written by [pageId]/+page.svelte, read by the layout's mobile top bar.
export const currentPageMeta = writable<{ title: string; icon: string | null } | null>(null);

export interface Page {
  id: string;
  title: string;
  icon: string | null;
  coverImage: string | null;
  content: string | null;
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

export function buildTree(pages: Page[]): PageTree[] {
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
