- [pnpm PATH setup](pnpm-path.md) — pnpm must be run with Node.js 22 in PATH; use the wrapper pattern in all workflow commands.
- [Version history feature](version-history.md) — page_version table + 3 API endpoints + VersionHistory.svelte panel with save/restore; content stored as Tiptap JSON string.
- [Drizzle self-referential FK](drizzle-self-ref-fk.md) — use AnySQLiteColumn (now SQLite) for self-referential references() callbacks.
- [Hono+D1 migration](hono-d1-migration.md) — full backend migrated from Elysia+Neon to Hono+CF D1; key patterns and gotchas documented.
- [Tailwind v4 + Vite setup](tailwind-v4-vite.md) — use @tailwindcss/vite plugin; delete postcss.config.js entirely; use @import "tailwindcss" + @theme inline in app.css.
- [kysely-shim-cf-workers](kysely-shim-cf-workers.md) — better-auth + wrangler bundling needs a kysely compat shim; DEFAULT_MIGRATION_* removed from kysely top-level in 0.28+.
- [wrangler-dev-replit](wrangler-dev-replit.md) — wrangler dev needs ip="0.0.0.0" and port=3000 in wrangler.toml [dev] section for Replit workflow port detection.
<<<<<<< HEAD
- [Tiptap v3 editor architecture](tiptap-v3-editor.md) — Liveblocks removed; Tiptap 3.25.0 + Svelte store pattern for slash menu; key import and API gotchas.
=======
- [Validation consistency](validation-consistency.md) — API routes must use shared Valibot schemas from @notion-clone/schemas; zod removed from api; ValiError → 400 in global error handler.
- [Eden-Hono client](eden-hono-client.md) — web app uses @elysiajs/eden treaty client against a Hono backend; works at runtime but type safety is broken; App type now exported from api/src/index.ts for future hc() migration.
>>>>>>> 75982b92e8c79649b1a477c4d72f3f54d9a5e844
