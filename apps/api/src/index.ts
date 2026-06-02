import { app } from "./app.js";

export type App = typeof app;

// Cloudflare Workers: export default, JANGAN app.listen() atau app.fetch
export default app;
