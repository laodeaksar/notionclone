import { treaty } from "@elysiajs/eden";
import type { App } from "api";

// In production (Vercel), API_BASE_URL points to the deployed API.
// In dev, Vite proxies /api → localhost:3000, so we use an empty base.
const apiBase =
  typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_API_URL
    ? (import.meta.env.PUBLIC_API_URL as string)
    : "";

// Empty string = relative URL → Vite proxies /api → localhost:3000 in dev
// PUBLIC_API_URL = full URL used in production (Vercel → Workers)
export const api = treaty<App>(apiBase, {
  fetch: {
    credentials: "include",
  },
});
