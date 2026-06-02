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

## Future migration path
Replace Eden with Hono's official typed client:
```ts
import { hc } from "hono/client";
import type { App } from "api";
export const api = hc<App>(apiBase, { fetch: (req, opts) => fetch(req, { ...opts, credentials: "include" }) });
```
Note: Hono client uses `$get`, `$post`, `$patch`, `$delete` method names ($ prefix) and path params use `[":id"]` bracket syntax instead of Eden's `({ id })` call syntax.
