---
name: Hono+D1 migration
description: Backend migrated from Elysia+Neon/Postgres to Hono+Cloudflare D1/SQLite — key patterns, gotchas, and file layout.
---

## Key patterns

### DB: per-request factory (not singleton)
D1Database binding is only available via `c.env.DB` at request time.
- `packages/db/src/index.ts` exports `getDb(d1: D1Database)` factory
- Routes call `const db = getDb(c.env.DB)` at the top of each handler
- `DB` type = `ReturnType<typeof getDb>`

### Auth: per-request factory
- `packages/auth/src/index.ts` exports `getAuth(d1, { secret, url, allowedOrigins })`
- Must pass all env values explicitly — `process.env` is NOT available in Workers (only `c.env.*`)
- Called in auth middleware and in `/api/auth/*` handler

### Schema: pg-core → sqlite-core
| Postgres | SQLite (D1) |
|---|---|
| `pgTable` | `sqliteTable` |
| `pgEnum` | removed — use `text.$type<'owner'\|'member'>()` |
| `timestamp()` | `integer({ mode: 'timestamp_ms' })` |
| `boolean()` | `integer({ mode: 'boolean' })` |
| `AnyPgColumn` | `AnySQLiteColumn` |
| `.defaultNow()` | `.$defaultFn(() => new Date())` |

### Cloudinary: replace npm package with WebCrypto
`cloudinary` npm package uses Node.js crypto — not available in Workers.
Replaced with inline `cloudinarySign()` using `crypto.subtle.digest("SHA-1", ...)`.
Cloudinary signature = SHA-1 of `sorted_params + api_secret` (NOT HMAC).

### Route migration pattern
```ts
// Elysia
new Elysia({ prefix: "/api/x" }).use(authMiddleware)
  .get("/:id", ({ params, session }) => data)

// Hono
new Hono<{ Bindings: Env; Variables: Variables }>()
  .use("*", authMiddleware)
  .get("/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    return c.json(data);
  })
```

### Route mounting
```ts
// app.ts:
app.route("/api/workspaces", workspaceRoutes);       // owns: /, /:id
app.route("/api/workspaces", workspaceMemberRoutes); // owns: /:id/members, /:id/members/:memberId
app.route("/api/pages", pageRoutes);
app.route("/api/upload", uploadRoutes);
app.route("/api", liveblocksRoutes);                 // owns: /liveblocks-auth
```

### D1 transactions
`db.transaction()` in D1 uses batch mode — not true ACID.
Works for our use case (workspace + member insert together).

### wrangler dev for local
Requires `pnpm.onlyBuiltDependencies: ["esbuild","sharp","workerd"]` in root package.json.
Run `wrangler d1 create notionclone` once to get database_id, then fill in wrangler.toml.

## Version conflict fix
Two drizzle-orm versions (0.44.x vs 0.45.x) cause TS errors: "separate declarations of private property 'shouldInlineParams'".
**Fix:** ensure ALL packages use same drizzle-orm semver (`^0.45.2`).

**Why:** pnpm deduplication only works if ranges are compatible.
