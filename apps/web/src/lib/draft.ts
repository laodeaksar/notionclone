import { get, set, del } from "idb-keyval";
import { browser } from "$app/environment";

export interface Draft {
  content: string;
  savedAt: number;
}

const key = (pageId: string) => `draft:${pageId}`;

export async function saveDraft(pageId: string, content: string): Promise<void> {
  if (!browser) return;
  await set(key(pageId), { content, savedAt: Date.now() } satisfies Draft);
}

export async function loadDraft(pageId: string): Promise<Draft | null> {
  if (!browser) return null;
  return (await get<Draft>(key(pageId))) ?? null;
}

export async function clearDraft(pageId: string): Promise<void> {
  if (!browser) return;
  await del(key(pageId));
}
