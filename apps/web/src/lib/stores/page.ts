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
