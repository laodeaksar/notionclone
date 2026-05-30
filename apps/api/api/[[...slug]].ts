/**
 * Vercel Serverless Function — catch-all handler for Elysia app.
 * Vercel routes every request through this file.
 */
import { app } from "../src/app.js";

export default app.handle;

export const config = {
  runtime: "nodejs22.x",
};
