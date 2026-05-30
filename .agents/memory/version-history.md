---
name: Version history feature
description: How page version snapshots are saved and restored — DB table, API endpoints, and frontend panel.
---

## DB table: `page_version` (packages/db/src/schema.ts)
Stores snapshots of page title + Tiptap JSON content + icon + coverImage at a point in time. Content column is `text` holding `JSON.stringify(editor.getJSON())`.

## API endpoints (apps/api/src/routes/page.ts)
- `GET  /api/pages/:id/versions` — list all versions newest-first, with savedByUser join
- `POST /api/pages/:id/versions` — body: `{ title, content }` — saves a snapshot
- `POST /api/pages/:id/versions/:versionId/restore` — restores title/icon/coverImage in DB, returns `{ page, content }` so frontend can call `editor.commands.setContent()`

## Frontend (apps/web/src/lib/components/)
- `VersionHistory.svelte` — slide-out right panel; `bind:open` prop, `onRestore` callback
- `PageEditor.svelte` — "💾 Save version" button calls `/api/pages/:id/versions`, "🕐 History" button opens panel; `handleRestore()` sets `titleValue` and calls `editor.commands.setContent()`

**Why content is Tiptap JSON not HTML:** Tiptap's `setContent()` accepts JSON natively and avoids XSS risks from raw HTML. Stored as a JSON string in the `text` column.
