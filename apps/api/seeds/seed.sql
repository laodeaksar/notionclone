-- Seed data for local development
-- Apply with: pnpm --filter api db:seed
-- Re-runnable — uses INSERT OR IGNORE so it's safe to run multiple times.

INSERT OR IGNORE INTO user (id, name, email, email_verified, created_at, updated_at)
VALUES (
  'user_seed_01',
  'Dev User',
  'dev@example.com',
  1,
  unixepoch('now') * 1000,
  unixepoch('now') * 1000
);

INSERT OR IGNORE INTO workspace (id, name, description, slug, created_at, updated_at)
VALUES (
  'ws_seed_01',
  'My Workspace',
  'Local development workspace',
  'my-workspace',
  unixepoch('now') * 1000,
  unixepoch('now') * 1000
);

INSERT OR IGNORE INTO workspace_member (id, workspace_id, user_id, role, created_at)
VALUES (
  'wm_seed_01',
  'ws_seed_01',
  'user_seed_01',
  'owner',
  unixepoch('now') * 1000
);

INSERT OR IGNORE INTO page (id, title, workspace_id, created_by, "order", is_archived, created_at, updated_at)
VALUES (
  'page_seed_01',
  'Welcome',
  'ws_seed_01',
  'user_seed_01',
  0,
  0,
  unixepoch('now') * 1000,
  unixepoch('now') * 1000
),
(
  'page_seed_02',
  'Getting Started',
  'ws_seed_01',
  'user_seed_01',
  1,
  0,
  unixepoch('now') * 1000,
  unixepoch('now') * 1000
),
(
  'page_seed_03',
  'Notes',
  'ws_seed_01',
  'user_seed_01',
  0,
  0,
  unixepoch('now') * 1000,
  unixepoch('now') * 1000
);

UPDATE page SET parent_id = 'page_seed_01' WHERE id = 'page_seed_03';
