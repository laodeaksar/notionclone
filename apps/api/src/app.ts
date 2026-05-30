import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "@notion-clone/auth";
import { HttpError } from "./errors.js";
import { workspaceRoutes } from "./routes/workspace.js";
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
      return { error: "Validation error" };
    }
    if (error instanceof HttpError) {
      set.status = error.status;
      return { error: error.message };
    }
    // Non-HttpError: log internally, never expose details to client
    console.error("[Internal Error]", error);
    const currentStatus = typeof set.status === "number" && set.status !== 200 ? set.status : 500;
    set.status = currentStatus;
    return { error: "Internal server error" };
  })
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .use(workspaceRoutes)
  .use(pageRoutes)
  .use(uploadRoutes)
  .use(liveblocksRoutes)
  .get("/health", () => ({ status: "ok", ts: new Date().toISOString() }));

export type App = typeof app;
