import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "@notion-clone/auth";
import { workspaceRoutes } from "./routes/workspace.js";
import { pageRoutes } from "./routes/page.js";
import { uploadRoutes } from "./routes/upload.js";
import { liveblocksRoutes } from "./routes/liveblocks.js";

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)
  .concat([
    "http://localhost:5000",
    "http://0.0.0.0:5000",
    "http://localhost:5173",
    "http://0.0.0.0:5173",
  ]);

export const app = new Elysia()
  .use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  )
  .onError(({ error, set, code }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Validation error", details: error.message };
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    const currentStatus = typeof set.status === "number" ? set.status : 200;
    if (currentStatus === 200 || currentStatus === 500) {
      if (/not found/i.test(message)) set.status = 404;
      else if (/forbidden/i.test(message)) set.status = 403;
      else if (/unauthorized/i.test(message)) set.status = 401;
      else set.status = 500;
    }
    return { error: message };
  })
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .use(workspaceRoutes)
  .use(pageRoutes)
  .use(uploadRoutes)
  .use(liveblocksRoutes)
  .get("/health", () => ({ status: "ok", ts: new Date().toISOString() }));

export type App = typeof app;
