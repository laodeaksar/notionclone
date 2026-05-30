import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "@notion-clone/auth";
import { workspaceRoutes } from "./routes/workspace.js";
import { pageRoutes } from "./routes/page.js";
import { uploadRoutes } from "./routes/upload.js";
import { liveblocksRoutes } from "./routes/liveblocks.js";

const app = new Elysia()
  .use(
    cors({
      origin: [
        "http://localhost:5000",
        "http://0.0.0.0:5000",
        "http://localhost:5173",
        "http://0.0.0.0:5173",
      ],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  )
  // Better Auth handler — all /api/auth/* requests
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  // Protected API routes
  .use(workspaceRoutes)
  .use(pageRoutes)
  .use(uploadRoutes)
  .use(liveblocksRoutes)
  .get("/health", () => ({ status: "ok", ts: new Date().toISOString() }))
  .listen(3000);

console.log(`🦊 Elysia API running at http://localhost:3000`);

export type App = typeof app;
