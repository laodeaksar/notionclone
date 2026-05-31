import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  index,
  unique,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── PageVersion ────────────────────────────────────────────────────────────────

export const pageVersion = pgTable(
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
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("page_version_page_idx").on(t.pageId),
    index("page_version_created_idx").on(t.createdAt),
  ]
);

// ── Enums ─────────────────────────────────────────────────────────────────────

export const workspaceRoleEnum = pgEnum("workspace_role", ["owner", "member"]);

// ── User ──────────────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  workspaceMembers: many(workspaceMember),
  pages: many(page),
}));

// ── Session ───────────────────────────────────────────────────────────────────

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

export const account = pgTable(
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
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("account_user_idx").on(t.userId),
  ]
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ── Verification ──────────────────────────────────────────────────────────────

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("verification_identifier_idx").on(t.identifier),
  ]
);

// ── Workspace ─────────────────────────────────────────────────────────────────

export const workspace = pgTable(
  "workspace",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("workspace_slug_idx").on(t.slug)]
);

export const workspaceRelations = relations(workspace, ({ many }) => ({
  members: many(workspaceMember),
  pages: many(page),
}));

// ── WorkspaceMember ───────────────────────────────────────────────────────────

export const workspaceMember = pgTable(
  "workspace_member",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull().default("member"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    unique("workspace_member_unique").on(t.workspaceId, t.userId),
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

export const page = pgTable(
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
    // Self-referential FK: set null so deleting a parent promotes children to root
    parentId: text("parent_id").references((): AnyPgColumn => page.id, {
      onDelete: "set null",
    }),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  savedByUser: one(user, { fields: [pageVersion.savedBy], references: [user.id] }),
}));
