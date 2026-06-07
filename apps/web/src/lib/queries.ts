import { api } from "$lib/eden.js";
import type {
  Page,
  Workspace,
  WorkspaceMember,
  PageVersion,
  CommentAuthor,
  CommentReply,
  CommentThread,
} from "@notion-clone/schemas";

export type {
  Page,
  Workspace,
  WorkspaceMember,
  PageVersion,
  CommentAuthor,
  CommentReply,
  CommentThread,
};

// ── staleTime policy ──────────────────────────────────────────────────────────
// STATIC   (60 s) — rarely changes: workspace list, member list
// CONTENT  (30 s) — user-driven edits: page list, individual page
// LIVE     (10 s) — other users change this too: comments
// VOLATILE  (0)  — always refetch: version history (explicit-save semantics)
const STALE = {
  STATIC: 60_000,
  CONTENT: 30_000,
  LIVE: 10_000,
  VOLATILE: 0,
} as const;

// ── Query Keys ────────────────────────────────────────────────────────────────

export const workspacesKey = () => ["workspaces"] as const;
export const pagesKey = (workspaceId: string) => ["pages", workspaceId] as const;
export const pageKey = (pageId: string) => ["page", pageId] as const;
export const versionsKey = (pageId: string) => ["versions", pageId] as const;
export const commentsKey = (pageId: string) => ["comments", pageId] as const;
export const membersKey = (workspaceId: string) => ["members", workspaceId] as const;

export const workspacesQueryKey = workspacesKey();
export const pagesQueryKey = pagesKey;

// ── Query Options ─────────────────────────────────────────────────────────────

export function workspacesQueryOptions() {
  return {
    queryKey: workspacesKey(),
    queryFn: async (): Promise<Workspace[]> => {
      const res = await api.api.workspaces.$get();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Workspace[]>;
    },
    staleTime: STALE.STATIC,
  };
}

export function pagesQueryOptions(workspaceId: string) {
  return {
    queryKey: pagesKey(workspaceId),
    queryFn: async (): Promise<Page[]> => {
      const res = await api.api.pages.$get({ query: { workspaceId } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Page[]>;
    },
    enabled: workspaceId.length > 0,
    staleTime: STALE.CONTENT,
  };
}

export function pageQueryOptions(pageId: string) {
  return {
    queryKey: pageKey(pageId),
    queryFn: async (): Promise<Page> => {
      const res = await api.api.pages[":id"].$get({ param: { id: pageId } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Page>;
    },
    enabled: pageId.length > 0,
    staleTime: STALE.CONTENT,
  };
}

export function versionsQueryOptions(pageId: string, enabled: boolean) {
  return {
    queryKey: versionsKey(pageId),
    queryFn: async (): Promise<PageVersion[]> => {
      const res = await api.api.pages[":id"].versions.$get({ param: { id: pageId } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<PageVersion[]>;
    },
    enabled: enabled && pageId.length > 0,
    staleTime: STALE.VOLATILE,
  };
}

export function workspaceMembersQueryOptions(workspaceId: string) {
  return {
    queryKey: membersKey(workspaceId),
    queryFn: async (): Promise<WorkspaceMember[]> => {
      const res = await api.api.workspaces[":id"].members.$get({ param: { id: workspaceId } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<WorkspaceMember[]>;
    },
    enabled: workspaceId.length > 0,
    staleTime: STALE.STATIC,
  };
}

export function commentsQueryOptions(pageId: string, enabled: boolean) {
  return {
    queryKey: commentsKey(pageId),
    queryFn: async (): Promise<CommentThread[]> => {
      const res = await api.api.pages[":pageId"].comments.$get({ param: { pageId } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<CommentThread[]>;
    },
    enabled: enabled && pageId.length > 0,
    staleTime: STALE.LIVE,
  };
}

// ── Mutation Functions ────────────────────────────────────────────────────────

export async function createWorkspaceFn(input: {
  name: string;
  description?: string;
}): Promise<Workspace> {
  const res = await api.api.workspaces.$post({ json: input });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Workspace>;
}

export async function deleteWorkspaceFn(id: string): Promise<void> {
  const res = await api.api.workspaces[":id"].$delete({ param: { id } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function createPageFn(input: {
  title: string;
  workspaceId: string;
  parentId?: string;
}): Promise<Page> {
  const res = await api.api.pages.$post({ json: input });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Page>;
}

export async function updatePageFn({
  id,
  ...input
}: {
  id: string;
  title?: string;
  content?: string | null;
  icon?: string | null;
  coverImage?: string | null;
}): Promise<Page> {
  const res = await api.api.pages[":id"].$patch({ param: { id }, json: input });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Page>;
}

export async function deletePageFn(id: string): Promise<void> {
  const res = await api.api.pages[":id"].$delete({ param: { id } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function reorderPageFn({
  id,
  parentId,
  order,
}: {
  id: string;
  parentId: string | null;
  order: number;
}): Promise<Page> {
  const res = await api.api.pages[":id"].reorder.$patch({
    param: { id },
    json: { parentId, order },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Page>;
}

export async function saveVersionFn(input: {
  pageId: string;
  title: string;
  content: string;
}): Promise<PageVersion> {
  const res = await api.api.pages[":id"].versions.$post({
    param: { id: input.pageId },
    json: { title: input.title, content: input.content },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<PageVersion>;
}

export async function restoreVersionFn(input: {
  pageId: string;
  versionId: string;
}): Promise<Page> {
  const res = await api.api.pages[":id"].versions[":versionId"].restore.$post({
    param: { id: input.pageId, versionId: input.versionId },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Page>;
}

export async function createCommentFn(input: {
  pageId: string;
  content: string;
  quote?: string;
}): Promise<CommentThread> {
  const res = await api.api.pages[":pageId"].comments.$post({
    param: { pageId: input.pageId },
    json: { content: input.content, quote: input.quote },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<CommentThread>;
}

export async function createReplyFn(input: {
  pageId: string;
  commentId: string;
  content: string;
}): Promise<CommentReply> {
  const res = await api.api.pages[":pageId"].comments[":commentId"].replies.$post({
    param: { pageId: input.pageId, commentId: input.commentId },
    json: { content: input.content },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<CommentReply>;
}

export async function updateCommentFn(input: {
  id: string;
  content?: string;
  resolved?: boolean;
}): Promise<void> {
  const { id, ...body } = input;
  const res = await api.api.comments[":id"].$patch({ param: { id }, json: body });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteCommentFn(id: string): Promise<void> {
  const res = await api.api.comments[":id"].$delete({ param: { id } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
