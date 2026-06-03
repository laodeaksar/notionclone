CREATE TABLE `comment` (
  `id` text PRIMARY KEY NOT NULL,
  `page_id` text NOT NULL,
  `author_id` text NOT NULL,
  `parent_id` text,
  `content` text NOT NULL,
  `quote` text,
  `resolved` integer NOT NULL DEFAULT false,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`page_id`) REFERENCES `page`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`parent_id`) REFERENCES `comment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comment_page_idx` ON `comment` (`page_id`);
--> statement-breakpoint
CREATE INDEX `comment_author_idx` ON `comment` (`author_id`);
--> statement-breakpoint
CREATE INDEX `comment_parent_idx` ON `comment` (`parent_id`);
