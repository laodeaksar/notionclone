export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderMentions(text: string, memberNames: string[]): string {
  const sorted = [...memberNames].sort((a, b) => b.length - a.length);
  let escaped = escapeHtml(text);
  for (const name of sorted) {
    const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    escaped = escaped.replace(
      new RegExp(`@(${safe})(?=[\\s,!?.\\n]|$)`, "g"),
      `<mark class="mention">@$1</mark>`
    );
  }
  return escaped;
}

export function detectMentionAtCursor(
  text: string,
  cursor: number
): { query: string; start: number } | null {
  const before = text.slice(0, cursor);
  const match = before.match(/(^|[\s\n])@(\w*)$/);
  if (!match) return null;
  const atIdx = before.lastIndexOf("@");
  return { query: match[2], start: atIdx };
}
