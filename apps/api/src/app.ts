import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAuth } from "@notion-clone/auth";
import { workspaceRoutes } from "./routes/workspace.js";
import { workspaceMemberRoutes } from "./routes/workspaceMember.js";
import { pageRoutes } from "./routes/page.js";
import { uploadRoutes } from "./routes/upload.js";
import { liveblocksRoutes } from "./routes/liveblocks.js";
import { HttpError } from "./errors.js";
import { openApiSpec } from "./openapi.js";
import type { Env, Variables } from "./types.js";

// ── In-memory rate limiter ─────────────────────────────────────────────────────
// Catatan: Workers tidak punya persistent memory antar request — map ini
// hidup per isolate (di-reset saat CF recycles isolate).
// Untuk production yang ketat, gunakan Durable Objects atau KV.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 120;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

// ── App ───────────────────────────────────────────────────────────────────────

export const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Origins are split per environment in wrangler.toml:
//   [vars]         → production origins
//   [env.dev.vars] → localhost dev origins
app.use("*", async (c, next) => {
  const allowedOrigins = (c.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return cors({
    origin: allowedOrigins,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })(c, next);
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use("*", async (c, next) => {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    c.req.header("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip)) {
    return c.json({ error: "Too many requests. Please try again later." }, 429);
  }
  await next();
});

// ── OpenAPI spec (public — must be before authenticated routes) ───────────────
app.get("/api/openapi.json", (c) => c.json(openApiSpec));

// ── Swagger UI (loaded from CDN) ──────────────────────────────────────────────
app.get("/docs", (c) =>
  c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Notion Clone API — Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: "/api/openapi.json",
      dom_id: "#swagger-ui",
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: "BaseLayout",
      deepLinking: true,
      defaultModelsExpandDepth: 1,
    });
  </script>
</body>
</html>`)
);

// ── Auth routes (better-auth handler) ────────────────────────────────────────
app.all("/api/auth/*", async (c) => {
  const auth = getAuth(c.env.DB, {
    secret: c.env.BETTER_AUTH_SECRET,
    url: c.env.BETTER_AUTH_URL,
    allowedOrigins: (c.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  });
  return auth.handler(c.req.raw);
});

// ── Business routes ───────────────────────────────────────────────────────────
app.route("/api/workspaces", workspaceRoutes);
app.route("/api/workspaces", workspaceMemberRoutes);
app.route("/api/pages", pageRoutes);
app.route("/api/upload", uploadRoutes);
app.route("/api", liveblocksRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (c) =>
  c.json({ status: "ok", ts: new Date().toISOString() })
);

// ── Global error handler ─────────────────────────────────────────────────────
app.onError((err, c) => {
  if (err instanceof HttpError) {
    return c.json({ error: err.message }, err.status as never);
  }
  console.error("[Internal Error]", err);
  return c.json({ error: "Internal server error" }, 500);
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: "Not found" }, 404));
