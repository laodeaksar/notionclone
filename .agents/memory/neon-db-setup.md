---
name: Neon vs postgres-js database setup
description: How packages/db/src/index.ts switches between Neon HTTP (production) and postgres.js (development).
---

## Rule
Use top-level await with dynamic imports in `packages/db/src/index.ts` to select the correct driver based on `NODE_ENV`.

```typescript
export const db: AnyDrizzle = await (async (): Promise<AnyDrizzle> => {
  if (process.env.NODE_ENV === "production") {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(connectionString), { schema });
  }
  const { default: postgres } = await import("postgres");
  const { drizzle } = await import("drizzle-orm/postgres-js");
  return drizzle(postgres(connectionString, { max: 10 }), { schema });
})();
```

**Why:** Neon's HTTP driver is serverless-optimized (no persistent TCP), required for edge/serverless deployments. postgres.js is faster for local development with persistent connections. Bun supports top-level await in ESM natively.

**How to apply:**
- Production DATABASE_URL: Neon connection string (postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require)
- Dev DATABASE_URL: local postgres (postgresql://postgres:password@localhost:5432/dbname)
- Set NODE_ENV=production in the API's production start command
- Type: `NeonHttpDatabase<schema> | PostgresJsDatabase<schema>` — both implement the same Drizzle query interface
