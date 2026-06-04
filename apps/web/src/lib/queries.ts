import { api } from "$lib/eden.js";
import type { Page } from "$lib/stores/page.js";
import type { Workspace } from "$lib/stores/workspace.js";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CommentAuthor {
  id: string;
  name: string;
  email: string;
}

export interface CommentReply {
  id: string;
  pageId: string;
  authorId: string;
  parentId: string;
  content: string;
  quote: string | null;
  resolved: boolean;
  createdAt: string | number;
  updatedAt: string | number;
  author: CommentAuthor;
}

export interface CommentThread {
  id: string;
  pageId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  quote: string | null;
  resolved: boolean;
  createdAt: string | number;
  updatedAt: string | number;
  author: CommentAuthor;
  replies: CommentReply[];
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: string;
  createdAt: string | number;
  user: { id: string; name: string; email: string; image: string | null };
}

export interface PageVersion {
  id: string;
  pageId: string;
  title: string;
  content: string;
  icon: string | null;
  coverImage: string | null;
  createdAt: string;
  savedByUser: { id: string; name: string; email: string };
}

// ── Query Keys ────────────────────────────────────────────────────────────────

export const workspacesKey = () => ["workspaces"] as const;
export const pagesKey = (workspaceId: string) => ["pages", workspaceId] as const;
export const pageKey = (pageId: string) => ["page", pageId] as const;
export const versionsKey = (pageId: string) => ["versions", pageId] as const;

// backward-compat aliases used in older Sidebar import
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
    staleTime: 60_000,
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
    staleTime: 30_000,
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
    staleTime: 30_000,
  };
}

export function versionsQueryOptions(pageId: string, enabled: boolean) {
  return {
    queryKey: versionsKey(pageId),
    queryFn: async (): Promise<PageVersion[]> => {
      const res = await fetch(`/api/pages/${pageId}/versions`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load history");
      return res.json() as Promise<PageVersion[]>;
    },
    enabled: enabled && pageId.length > 0,
    staleTime: 0,
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

export async function saveVersionFn(input: {
  pageId: string;
  title: string;
  content: string;
}): Promise<PageVersion> {
  const res = await fetch(`/api/pages/${input.pageId}/versions`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.title, content: input.content }),
  });
  if (!res.ok) throw new Error("Server error");
  return res.json() as Promise<PageVersion>;
}

export async function restoreVersionFn(input: {
  pageId: string;
  versionId: string;
}): Promise<Page> {
  const res = await fetch(
    `/api/pages/${input.pageId}/versions/${input.versionId}/restore`,
    { method: "POST", credentials: "include" }
  );
  if (!res.ok) throw new Error("Restore failed");
  return res.json() as Promise<Page>;
}

// ── Workspace Members ─────────────────────────────────────────────────────────

export function workspaceMembersQueryOptions(workspaceId: string) {
  return {
    queryKey: membersKey(workspaceId),
    queryFn: async (): Promise<WorkspaceMember[]> => {
      const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load members");
      return res.json() as Promise<WorkspaceMember[]>;
    },
    enabled: workspaceId.length > 0,
    staleTime: 60_000,
  };
}

// ── Comment Query / Mutations ─────────────────────────────────────────────────

export function commentsQueryOptions(pageId: string, enabled: boolean) {
  return {
    queryKey: commentsKey(pageId),
    queryFn: async (): Promise<CommentThread[]> => {
      const res = await fetch(`/api/pages/${pageId}/comments`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load comments");
      return res.json() as Promise<CommentThread[]>;
    },
    enabled: enabled && pageId.length > 0,
    staleTime: 10_000,
  };
}

export async function createCommentFn(input: {
  pageId: string;
  content: string;
  quote?: string;
}): Promise<CommentThread> {
  const res = await fetch(`/api/pages/${input.pageId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: input.content, quote: input.quote }),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json() as Promise<CommentThread>;
}

export async function createReplyFn(input: {
  pageId: string;
  commentId: string;
  content: string;
}): Promise<CommentReply> {
  const res = await fetch(
    `/api/pages/${input.pageId}/comments/${input.commentId}/replies`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.content }),
    }
  );
  if (!res.ok) throw new Error("Failed to create reply");
  return res.json() as Promise<CommentReply>;
}

export async function updateCommentFn(input: {
  id: string;
  content?: string;
  resolved?: boolean;
}): Promise<void> {
  const { id, ...body } = input;
  const res = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update comment");
}

export async function deleteCommentFn(id: string): Promise<void> {
  const res = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete comment");
}
