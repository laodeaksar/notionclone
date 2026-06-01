import { defineConfig } from "drizzle-kit";

/**
 * Generate migrations SQL: pnpm db:generate
 * Apply lokal:    wrangler d1 migrations apply notionclone --local
 * Apply prod:     wrangler d1 migrations apply notionclone
 */
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
