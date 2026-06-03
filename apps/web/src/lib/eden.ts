import { hc } from "hono/client";
import type { App } from "api";

// In dev, Vite proxies /api → localhost:3000, so we use an empty base.
// In production (Vercel), PUBLIC_API_URL points to the deployed Workers API.
const apiBase =
  typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_API_URL
    ? (import.meta.env.PUBLIC_API_URL as string)
    : "";

export const api = hc<App>(apiBase, {
  fetch: (req: RequestInfo | URL, options?: RequestInit) =>
    fetch(req, { ...options, credentials: "include" }),
});
