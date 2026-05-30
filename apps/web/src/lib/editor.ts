import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import type { Doc } from "yjs";

export interface EditorOptions {
  element: HTMLElement;
  ydoc: Doc;
  provider: unknown;
  userName: string;
  placeholder?: string;
}

export function createEditor({
  element,
  ydoc,
  provider,
  userName,
  placeholder = "Start writing...",
}: EditorOptions): Editor {
  return new Editor({
    element,
    extensions: [
      StarterKit.configure({
        // Disable history — Collaboration handles it
        history: false,
      }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: userName,
          color: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
        },
      }),
      Image.configure({ inline: true, allowBase64: true }),
      Placeholder.configure({ placeholder }),
      Typography,
    ],
  });
}

/**
 * Upload an image via Cloudinary signed upload, return the URL.
 */
export async function uploadImage(file: File): Promise<string> {
  // 1. Get signature from API
  const sigRes = await fetch("/api/upload/signature", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!sigRes.ok) throw new Error("Failed to get upload signature");
  const { signature, timestamp, folder, apiKey, cloudName } =
    await sigRes.json();

  // 2. Upload to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
  const data = await uploadRes.json();
  return data.secure_url as string;
}
