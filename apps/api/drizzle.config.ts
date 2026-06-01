import { defineConfig } from "drizzle-kit";

/**
 * Generate SQL migrations dari schema:
 *   pnpm db:generate
 *
 * Apply ke D1 lokal:
 *   pnpm db:migrate   (= wrangler d1 migrations apply notionclone --local)
 *
 * Apply ke D1 production:
 *   pnpm db:migrate:prod   (= wrangler d1 migrations apply notionclone)
 *
 * Untuk push via d1-http (Cloudflare REST API), set env vars:
 *   CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN
 */
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
