---
name: kysely shim for CF Workers + better-auth
description: How to fix better-auth bundling failure in wrangler dev due to missing DEFAULT_MIGRATION_* exports in kysely 0.28+
---

## Problem
`wrangler dev` fails with: `@better-auth/kysely-adapter` imports `DEFAULT_MIGRATION_TABLE` and `DEFAULT_MIGRATION_LOCK_TABLE` from `"kysely"` (top-level), but kysely 0.28+ moved these to `kysely/dist/migration/migrator.js` only — not re-exported from the main index.

Also, `better-auth/dist/db/get-migration.mjs` imports `sql` from `"kysely"` directly, so the full kysely API must be available even when using the drizzle adapter.

## Root Cause
- `@better-auth/kysely-adapter@1.6.x` claims peer dep `kysely: "^0.28.17 || ^0.29.0"` but imports symbols removed in those versions.
- better-auth's internal migration code also imports `sql` from `"kysely"`.
- esbuild bundles ALL imports including dead code paths (the kysely adapter code path is never reached when using drizzle adapter, but esbuild still tries to resolve it).

## Fix
1. Create `apps/api/kysely-shim.js` that re-exports everything from kysely's actual dist files via relative/absolute path (bypasses exports map, avoids circular import), plus the two missing constants:

```js
export * from "../../node_modules/kysely/dist/index.js";
export { DEFAULT_MIGRATION_TABLE, DEFAULT_MIGRATION_LOCK_TABLE } from "../../node_modules/kysely/dist/migration/migrator.js";
```

2. Add wrangler alias in `apps/api/wrangler.toml`:
```toml
[alias]
kysely = "./kysely-shim"
```

**Why:** The wrangler `[alias]` replaces the `"kysely"` specifier → shim. The shim imports from direct file paths (not `"kysely"` specifier) so no circular import. The `../../node_modules/kysely/dist/index.js` path bypasses the kysely package exports map restriction (exports map only applies to package specifier resolution, not direct file paths).

**How to apply:** Any time better-auth is used with wrangler and the build fails with missing kysely exports. Check that the relative path from the shim to node_modules is correct (from `apps/api/` → `../../node_modules/`).
