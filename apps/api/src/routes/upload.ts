import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import type { Env, Variables } from "../types.js";

// ── Workers-compatible Cloudinary signing ─────────────────────────────────────
// Package `cloudinary` menggunakan Node.js crypto yang tidak tersedia di Workers.
// Kita generate signature pakai Web Crypto API (SHA-1 tanpa HMAC — sesuai spec Cloudinary).
async function cloudinarySign(
  params: Record<string, string | number>,
  apiSecret: string
): Promise<string> {
  const toSign =
    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&") + apiSecret;

  const buf = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(toSign)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const uploadRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()
  .use("*", authMiddleware)

  // POST /api/upload/signature
  .post("/signature", async (c) => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
      c.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return c.json(
        { error: "Cloudinary is not configured on this server" },
        503
      );
    }

    const session = c.get("session");
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `notion-clone/${session.user.id}`;
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
    };

    const signature = await cloudinarySign(paramsToSign, CLOUDINARY_API_SECRET);

    return c.json({
      signature,
      timestamp,
      folder,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
    });
  });
