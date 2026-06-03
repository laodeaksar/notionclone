---
name: Eden-Hono client mismatch
description: The web app uses Elysia Eden treaty client against a Hono backend — works at runtime, type safety is broken.
---

# Eden treaty client vs Hono backend

## Situation
`apps/web/src/lib/eden.ts` uses `@elysiajs/eden`'s `treaty<App>()` client. The backend is Hono, not Elysia.

## Why it works at runtime
Eden's `treaty` is just a Proxy that builds URLs from method chains and calls `fetch`. For example:
- `api.api.workspaces.get()` → `GET /api/workspaces`
- `api.api.workspaces({ id }).delete()` → `DELETE /api/workspaces/:id`

The HTTP calls succeed because the URL construction happens to match what Hono routes expect.

## Why type safety is broken
`treaty<App>` expects an Elysia app type. A Hono app type has a completely different shape. All the store files use `as unknown as SomeType` casts to work around this. TypeScript won't catch endpoint mismatches.

## Exported App type (as of 2026-06-02)
`apps/api/src/index.ts` now exports `export type App = typeof app;` — this prepares for a future migration to Hono's `hc()` client.

## Migration (completed 2026-06-02)
Eden replaced with Hono `hc` client in `apps/web/src/lib/eden.ts`. Export name kept as `api` to minimize store changes.

**Hono client syntax (vs old Eden syntax):**
- `api.api.workspaces.$get()` was `api.api.workspaces.get()`
- `api.api.workspaces.$post({ json: {name} })` was `.post({name})`
- `api.api.workspaces[":id"].$delete({ param: { id } })` was `.({ id }).delete()`
- `api.api.pages.$get({ query: { workspaceId } })` was `.get({ query: ... })`
- Response is `Response`, not `{ data, error }` — use `if (!res.ok)` + `await res.json()`

**Why:**
- `@elysiajs/eden` is for Elysia apps; using it with Hono gave zero type safety
- `elysia` and `@elysiajs/eden` removed from `apps/web/package.json`, `hono` added
