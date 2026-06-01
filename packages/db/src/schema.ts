import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ── Types (menggantikan pgEnum — D1/SQLite tidak punya native enum) ────────────
export type WorkspaceRole = "owner" | "member";

// ── PageVersion ────────────────────────────────────────────────────────────────

export const pageVersion = sqliteTable(
  "page_version",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => page.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull().default("{}"),
    icon: text("icon"),
    coverImage: text("cover_image"),
    savedBy: text("saved_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // SQLite: timestamp disimpan sebagai integer milliseconds
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("page_version_page_idx").on(t.pageId),
    index("page_version_created_idx").on(t.createdAt),
  ]
);

// ── User ──────────────────────────────────────────────────────────────────────

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  // SQLite: boolean disimpan sebagai integer 0/1
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  workspaceMembers: many(workspaceMember),
  pages: many(page),
}));

// ── Session ───────────────────────────────────────────────────────────────────

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

// ── Account ───────────────────────────────────────────────────────────────────

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("account_user_idx").on(t.userId)]
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ── Verification ──────────────────────────────────────────────────────────────

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(
      () => new Date()
    ),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(
      () => new Date()
    ),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)]
);

// ── Workspace ─────────────────────────────────────────────────────────────────

export const workspace = sqliteTable(
  "workspace",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("workspace_slug_idx").on(t.slug)]
);

export const workspaceRelations = relations(workspace, ({ many }) => ({
  members: many(workspaceMember),
  pages: many(page),
}));

// ── WorkspaceMember ───────────────────────────────────────────────────────────

export const workspaceMember = sqliteTable(
  "workspace_member",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // pgEnum diganti text — constraint hanya di TypeScript, bukan DB level
    role: text("role").$type<WorkspaceRole>().notNull().default("member"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("workspace_member_unique").on(t.workspaceId, t.userId),
    index("workspace_member_workspace_idx").on(t.workspaceId),
    index("workspace_member_user_idx").on(t.userId),
  ]
);

export const workspaceMemberRelations = relations(
  workspaceMember,
  ({ one }) => ({
    workspace: one(workspace, {
      fields: [workspaceMember.workspaceId],
      references: [workspace.id],
    }),
    user: one(user, {
      fields: [workspaceMember.userId],
      references: [user.id],
    }),
  })
);

// ── Page ──────────────────────────────────────────────────────────────────────

export const page = sqliteTable(
  "page",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull().default("Untitled"),
    icon: text("icon"),
    coverImage: text("cover_image"),
    content: text("content"),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    // Self-referential FK: set null agar anak menjadi root saat parent dihapus
    parentId: text("parent_id").references(
      (): AnySQLiteColumn => page.id,
      { onDelete: "set null" }
    ),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    isArchived: integer("is_archived", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("page_workspace_idx").on(t.workspaceId),
    index("page_parent_idx").on(t.parentId),
    index("page_created_by_idx").on(t.createdBy),
  ]
);

export const pageRelations = relations(page, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [page.workspaceId],
    references: [workspace.id],
  }),
  parent: one(page, {
    fields: [page.parentId],
    references: [page.id],
    relationName: "pageChildren",
  }),
  children: many(page, { relationName: "pageChildren" }),
  creator: one(user, { fields: [page.createdBy], references: [user.id] }),
  versions: many(pageVersion),
}));

export const pageVersionRelations = relations(pageVersion, ({ one }) => ({
  page: one(page, { fields: [pageVersion.pageId], references: [page.id] }),
  savedByUser: one(user, {
    fields: [pageVersion.savedBy],
    references: [user.id],
  }),
}));
