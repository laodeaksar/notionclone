import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

app.listen(port);
console.log(`🦊 Elysia API running at http://localhost:${port}`);

const shutdown = () => {
  console.log("Shutting down gracefully...");
  app.stop();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export type { App } from "./app.js";
