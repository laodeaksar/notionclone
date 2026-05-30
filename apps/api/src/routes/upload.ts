import { Elysia } from "elysia";
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "../middleware/auth.js";

const CLOUDINARY_VARS = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

const missingCloudinaryVars = CLOUDINARY_VARS.filter((v) => !process.env[v]);
if (missingCloudinaryVars.length > 0) {
  console.warn(
    `[upload] Cloudinary not fully configured — missing: ${missingCloudinaryVars.join(", ")}. Upload endpoint will fail at runtime.`
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadRoutes = new Elysia({ prefix: "/api/upload" })
  .use(authMiddleware)
  .post("/signature", async ({ session }) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `notion-clone/${session.user.id}`;
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );
    return {
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    };
  });
