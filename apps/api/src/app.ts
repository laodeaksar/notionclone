import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "@notion-clone/auth";
import { HttpError } from "./errors.js";
import { workspaceRoutes } from "./routes/workspace.js";
import { workspaceMemberRoutes } from "./routes/workspaceMember.js";
import { pageRoutes } from "./routes/page.js";
import { uploadRoutes } from "./routes/upload.js";
import { liveblocksRoutes } from "./routes/liveblocks.js";

const envOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const devOrigins =
  process.env.NODE_ENV !== "production"
    ? [
        "http://localhost:5000",
        "http://0.0.0.0:5000",
        "http://localhost:5173",
        "http://0.0.0.0:5173",
      ]
    : [];

const allowedOrigins = [...envOrigins, ...devOrigins];

// ── In-memory rate limiter ────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX = 120;          // requests per window per IP

// Periodically clean up expired entries to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt < now) rateLimitMap.delete(key);
  }
}, RATE_WINDOW_MS);

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

export const app = new Elysia()
  .use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  )
  .onBeforeHandle(({ request, set }) => {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    if (!checkRateLimit(ip)) {
      set.status = 429;
      return { error: "Too many requests. Please try again later." };
    }
  })
  .onError(({ error, set, code }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Validation error" };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Not found" };
    }
    if (error instanceof HttpError) {
      set.status = error.status;
      return { error: error.message };
    }
    console.error("[Internal Error]", error);
    const currentStatus =
      typeof set.status === "number" && set.status !== 200
        ? set.status
        : 500;
    set.status = currentStatus;
    return { error: "Internal server error" };
  })
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .use(workspaceRoutes)
  .use(workspaceMemberRoutes)
  .use(pageRoutes)
  .use(uploadRoutes)
  .use(liveblocksRoutes)
  .get("/health", () => ({ status: "ok", ts: new Date().toISOString() }));

export type App = typeof app;
