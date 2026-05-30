import { treaty } from "@elysiajs/eden";
import type { App } from "api";

export const api = treaty<App>("http://localhost:3000", {
  fetch: {
    credentials: "include",
  },
});
