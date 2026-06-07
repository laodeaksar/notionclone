import * as v from "valibot";

// ── Auth schemas ──────────────────────────────────────────────────────────────

export const SignUpSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
  name: v.pipe(v.string(), v.minLength(1)),
});

export const SignInSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(1)),
});

export type SignUpInput = v.InferInput<typeof SignUpSchema>;
export type SignInInput = v.InferInput<typeof SignInSchema>;

// ── Domain response types ─────────────────────────────────────────────────────
// Single source of truth for all API response shapes used by both
// the frontend (stores, queries) and the backend (routes).

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: string;
  createdAt: string | number;
  user: { id: string; name: string; email: string; image: string | null };
}

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

// ── Workspace schemas ─────────────────────────────────────────────────────────

export const WorkspaceCreateSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  description: v.optional(v.string()),
});

export const WorkspaceUpdateSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
  description: v.optional(v.string()),
});

export type WorkspaceCreateInput = v.InferInput<typeof WorkspaceCreateSchema>;
export type WorkspaceUpdateInput = v.InferInput<typeof WorkspaceUpdateSchema>;

// ── Workspace member schemas ──────────────────────────────────────────────────

export const WorkspaceMemberInviteSchema = v.object({
  userId: v.pipe(v.string(), v.minLength(1)),
  role: v.optional(v.picklist(["owner", "member"]), "member"),
});

export const WorkspaceMemberUpdateSchema = v.object({
  role: v.picklist(["owner", "member"]),
});

export type WorkspaceMemberInviteInput = v.InferInput<typeof WorkspaceMemberInviteSchema>;
export type WorkspaceMemberUpdateInput = v.InferInput<typeof WorkspaceMemberUpdateSchema>;

// ── Page schemas ──────────────────────────────────────────────────────────────

export const PageCreateSchema = v.object({
  title: v.string(),
  workspaceId: v.string(),
  parentId: v.optional(v.string()),
  icon: v.optional(v.string()),
  coverImage: v.optional(v.string()),
});

export const PageUpdateSchema = v.object({
  title: v.optional(v.string()),
  icon: v.optional(v.nullable(v.string())),
  coverImage: v.optional(v.nullable(v.string())),
  content: v.optional(v.nullable(v.string())),
  parentId: v.optional(v.nullable(v.string())),
});

export const PageReorderSchema = v.object({
  parentId: v.optional(v.nullable(v.string())),
  order: v.number(),
});

export const PageVersionSaveSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1)),
  content: v.string(),
});

export type PageCreateInput = v.InferInput<typeof PageCreateSchema>;
export type PageUpdateInput = v.InferInput<typeof PageUpdateSchema>;
export type PageReorderInput = v.InferInput<typeof PageReorderSchema>;
export type PageVersionSaveInput = v.InferInput<typeof PageVersionSaveSchema>;

// ── Comment schemas ───────────────────────────────────────────────────────────

export const CommentCreateSchema = v.object({
  content: v.pipe(v.string(), v.minLength(1)),
  quote: v.optional(v.string()),
});

export const CommentReplyCreateSchema = v.object({
  content: v.pipe(v.string(), v.minLength(1)),
});

export const CommentUpdateSchema = v.object({
  content: v.optional(v.pipe(v.string(), v.minLength(1))),
  resolved: v.optional(v.boolean()),
});

export type CommentCreateInput = v.InferInput<typeof CommentCreateSchema>;
export type CommentReplyCreateInput = v.InferInput<typeof CommentReplyCreateSchema>;
export type CommentUpdateInput = v.InferInput<typeof CommentUpdateSchema>;

// ── Upload schemas ────────────────────────────────────────────────────────────

export const UploadSignatureSchema = v.object({
  folder: v.optional(v.string()),
  publicId: v.optional(v.string()),
});

export type UploadSignatureInput = v.InferInput<typeof UploadSignatureSchema>;
