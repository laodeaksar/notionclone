-- Migration: 0000_initial_schema
-- Generated from packages/db/src/schema.ts (SQLite / Cloudflare D1)

CREATE TABLE `user` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `email_verified` integer DEFAULT false NOT NULL,
  `image` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
--> statement-breakpoint

CREATE TABLE `session` (
  `id` text PRIMARY KEY NOT NULL,
  `expires_at` integer NOT NULL,
  `token` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  `ip_address` text,
  `user_agent` text,
  `user_id` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);
--> statement-breakpoint

CREATE TABLE `account` (
  `id` text PRIMARY KEY NOT NULL,
  `account_id` text NOT NULL,
  `provider_id` text NOT NULL,
  `user_id` text NOT NULL,
  `access_token` text,
  `refresh_token` text,
  `id_token` text,
  `access_token_expires_at` integer,
  `refresh_token_expires_at` integer,
  `scope` text,
  `password` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_user_idx` ON `account` (`user_id`);
--> statement-breakpoint

CREATE TABLE `verification` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expires_at` integer NOT NULL,
  `created_at` integer,
  `updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);
--> statement-breakpoint

CREATE TABLE `workspace` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `slug` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspace_slug_unique` ON `workspace` (`slug`);
--> statement-breakpoint
CREATE INDEX `workspace_slug_idx` ON `workspace` (`slug`);
--> statement-breakpoint

CREATE TABLE `workspace_member` (
  `id` text PRIMARY KEY NOT NULL,
  `workspace_id` text NOT NULL,
  `user_id` text NOT NULL,
  `role` text DEFAULT 'member' NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspace_member_unique` ON `workspace_member` (`workspace_id`, `user_id`);
--> statement-breakpoint
CREATE INDEX `workspace_member_workspace_idx` ON `workspace_member` (`workspace_id`);
--> statement-breakpoint
CREATE INDEX `workspace_member_user_idx` ON `workspace_member` (`user_id`);
--> statement-breakpoint

CREATE TABLE `page` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text DEFAULT 'Untitled' NOT NULL,
  `icon` text,
  `cover_image` text,
  `content` text,
  `workspace_id` text NOT NULL,
  `parent_id` text,
  `created_by` text NOT NULL,
  `order` integer DEFAULT 0 NOT NULL,
  `is_archived` integer DEFAULT false NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`parent_id`) REFERENCES `page`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_workspace_idx` ON `page` (`workspace_id`);
--> statement-breakpoint
CREATE INDEX `page_parent_idx` ON `page` (`parent_id`);
--> statement-breakpoint
CREATE INDEX `page_created_by_idx` ON `page` (`created_by`);
--> statement-breakpoint

CREATE TABLE `page_version` (
  `id` text PRIMARY KEY NOT NULL,
  `page_id` text NOT NULL,
  `title` text NOT NULL,
  `content` text DEFAULT '{}' NOT NULL,
  `icon` text,
  `cover_image` text,
  `saved_by` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`page_id`) REFERENCES `page`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`saved_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_version_page_idx` ON `page_version` (`page_id`);
--> statement-breakpoint
CREATE INDEX `page_version_created_idx` ON `page_version` (`created_at`);
