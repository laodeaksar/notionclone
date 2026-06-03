---
name: TanStack Query architecture
description: How queries and mutations are structured in the web app using @tanstack/svelte-query.
---

All server data fetching and mutations go through TanStack Query. Svelte writable stores are only used for UI selection state (not data caching).

## Key files
- `apps/web/src/lib/queries.ts` — single source of truth: query key factories, query option functions, and async mutation functions.
- `apps/web/src/routes/+layout.svelte` — wraps the app in `<QueryClientProvider>`.
- `apps/web/src/lib/stores/workspace.ts` — only exports `Workspace` type + `currentWorkspaceId` writable (no fetch logic).
- `apps/web/src/lib/stores/page.ts` — only exports `Page`, `PageTree` types + `buildTree()` (no fetch logic).

## Query keys
```ts
workspacesKey()              // ["workspaces"]
pagesKey(workspaceId)        // ["pages", workspaceId]
pageKey(pageId)              // ["page", pageId]
versionsKey(pageId)          // ["versions", pageId]
```

## Pattern
- `createQuery(() => queryOptions(...))` — reactive, re-runs when derived args change.
- `createMutation(() => ({ mutationFn, onSuccess }))` — invalidates relevant query keys in `onSuccess`.
- After mutations that affect sidebar (create/delete/rename page), invalidate `pagesKey(workspaceId)`.
- After title rename, also call `qc.setQueryData(pageKey(id), updated)` to update page cache immediately.
- Versions panel uses `enabled: open` so it only fetches when the panel opens.

## currentWorkspaceId
Simple `writable<string | null>` in workspace.ts. Sidebar auto-sets it to the first workspace on load via `$effect`. Switching workspaces calls `currentWorkspaceId.set(id)`.

**Why:** Eliminates the old workspaceStore/pageStore fetch-in-store pattern which mixed data fetching with UI state, causing double-fetch bugs and stale cache issues.
