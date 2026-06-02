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

// ── Upload schemas ────────────────────────────────────────────────────────────

export const UploadSignatureSchema = v.object({
  folder: v.optional(v.string()),
  publicId: v.optional(v.string()),
});

export type UploadSignatureInput = v.InferInput<typeof UploadSignatureSchema>;

// ── Liveblocks schemas ────────────────────────────────────────────────────────

export const LiveblocksAuthSchema = v.object({
  room: v.string(),
});

export type LiveblocksAuthInput = v.InferInput<typeof LiveblocksAuthSchema>;
