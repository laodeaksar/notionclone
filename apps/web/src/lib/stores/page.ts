import { writable } from "svelte/store";
import type { Page, PageTree } from "@notion-clone/schemas";

export type { Page, PageTree };

// Holds the title + icon of whichever page is currently open.
// Written by [pageId]/+page.svelte, read by the layout's mobile top bar.
export const currentPageMeta = writable<{ title: string; icon: string | null } | null>(null);

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
