import { Editor, Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import { FileHandler } from "@tiptap/extension-file-handler";
import { Suggestion } from "@tiptap/suggestion";
import { writable, get } from "svelte/store";

// ── Slash menu items ──────────────────────────────────────────────────────────

export interface SlashItem {
  title: string;
  description: string;
  icon: string;
  command: (editor: Editor) => void;
}

export const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: "H1",
    command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Paragraph",
    description: "Plain text block",
    icon: "¶",
    command: (e) => e.chain().focus().setParagraph().run(),
  },
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: "•",
    command: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Ordered List",
    description: "Numbered list",
    icon: "1.",
    command: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Code Block",
    description: "Code snippet",
    icon: "</>",
    command: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Blockquote",
    description: "Quote or callout",
    icon: "❝",
    command: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Divider",
    description: "Horizontal separator",
    icon: "—",
    command: (e) => e.chain().focus().setHorizontalRule().run(),
  },
];

// ── Slash menu reactive state (writable store) ────────────────────────────────

export interface SlashMenuState {
  open: boolean;
  items: SlashItem[];
  selectedIndex: number;
  coords: { left: number; top: number } | null;
  executeCommand: ((item: SlashItem) => void) | null;
}

export const slashMenuStore = writable<SlashMenuState>({
  open: false,
  items: [],
  selectedIndex: 0,
  coords: null,
  executeCommand: null,
});

// ── Custom Image extension with align attribute ────────────────────────────────

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        renderHTML: (attrs) => {
          const styleMap: Record<string, string> = {
            left: "display:block;margin-left:0;margin-right:auto;",
            center: "display:block;margin-left:auto;margin-right:auto;",
            right: "display:block;margin-left:auto;margin-right:0;",
            "full-width": "display:block;width:100%;",
          };
          return {
            style: styleMap[attrs.align as string] ?? styleMap.center,
            "data-align": attrs.align,
          };
        },
        parseHTML: (element) =>
          element.getAttribute("data-align") ?? "center",
      },
    };
  },
});

// ── Slash command Extension ───────────────────────────────────────────────────

const SlashMenuExtension = Extension.create({
  name: "slashMenu",

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      Suggestion({
        editor,
        char: "/",
        startOfLine: false,
        allowedPrefixes: null,

        items: ({ query }: { query: string }) => {
          const q = query.toLowerCase().trim();
          if (!q) return SLASH_ITEMS;
          return SLASH_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
          );
        },

        command: ({
          editor: ed,
          range,
          props,
        }: {
          editor: Editor;
          range: { from: number; to: number };
          props: SlashItem;
        }) => {
          ed.chain().focus().deleteRange(range).run();
          props.command(ed);
        },

        render: () => {
          let localItems: SlashItem[] = [];
          let localCommand: ((item: SlashItem) => void) | null = null;
          let selectedIndex = 0;

          return {
            onStart(props: any) {
              localItems = props.items as SlashItem[];
              localCommand = props.command;
              selectedIndex = 0;
              const rect: DOMRect | undefined = props.clientRect?.();
              slashMenuStore.set({
                open: true,
                items: localItems,
                selectedIndex: 0,
                coords: rect
                  ? { left: rect.left, top: rect.bottom + 6 }
                  : null,
                executeCommand: (item) => localCommand?.(item),
              });
            },

            onUpdate(props: any) {
              localItems = props.items as SlashItem[];
              localCommand = props.command;
              selectedIndex = 0;
              const rect: DOMRect | undefined = props.clientRect?.();
              slashMenuStore.update((s) => ({
                ...s,
                items: localItems,
                selectedIndex: 0,
                coords: rect
                  ? { left: rect.left, top: rect.bottom + 6 }
                  : s.coords,
                executeCommand: (item) => localCommand?.(item),
              }));
            },

            onExit() {
              slashMenuStore.update((s) => ({ ...s, open: false }));
            },

            onKeyDown({ event }: { event: KeyboardEvent }) {
              const state = get(slashMenuStore);
              if (!state.open) return false;

              if (event.key === "ArrowDown") {
                selectedIndex =
                  (selectedIndex + 1) % (localItems.length || 1);
                slashMenuStore.update((s) => ({ ...s, selectedIndex }));
                return true;
              }
              if (event.key === "ArrowUp") {
                selectedIndex =
                  (selectedIndex - 1 + (localItems.length || 1)) %
                  (localItems.length || 1);
                slashMenuStore.update((s) => ({ ...s, selectedIndex }));
                return true;
              }
              if (event.key === "Enter") {
                const item = localItems[selectedIndex];
                if (item) localCommand?.(item);
                return true;
              }
              if (event.key === "Escape") {
                slashMenuStore.update((s) => ({ ...s, open: false }));
                return false;
              }
              return false;
            },
          };
        },
      }),
    ];
  },
});

// ── Editor factory ────────────────────────────────────────────────────────────

export interface CreateEditorOptions {
  element: HTMLElement;
  content?: string | null;
  placeholder?: string;
  onUpdate?: (contentJson: string) => void;
}

export function createEditor({
  element,
  content,
  placeholder = "Start writing, or press / for commands…",
  onUpdate,
}: CreateEditorOptions): Editor {
  let parsedContent: object | null = null;
  if (content) {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = null;
    }
  }

  return new Editor({
    element,
    content: parsedContent ?? undefined,
    extensions: [
      StarterKit,
      CustomImage.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder }),
      Typography,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      SlashMenuExtension,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach(async (file: File) => {
            try {
              const url = await uploadImage(file);
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: { src: url, align: "center" },
                })
                .run();
            } catch (err) {
              console.error("Drop upload failed", err);
            }
          });
        },
        onPaste: (currentEditor, files) => {
          files.forEach(async (file: File) => {
            try {
              const url = await uploadImage(file);
              currentEditor
                .chain()
                .insertContent({
                  type: "image",
                  attrs: { src: url, align: "center" },
                })
                .run();
            } catch (err) {
              console.error("Paste upload failed", err);
            }
          });
        },
      }),
    ],
    onUpdate: ({ editor: ed }) => {
      onUpdate?.(JSON.stringify(ed.getJSON()));
    },
  });
}

// ── Cloudinary image upload ───────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
  const sigRes = await fetch("/api/upload/signature", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!sigRes.ok) throw new Error("Failed to get upload signature");
  const sigData = await sigRes.json() as {
    signature: string;
    timestamp: number;
    folder: string;
    apiKey: string;
    cloudName: string;
  };
  const { signature, timestamp, folder, apiKey, cloudName } = sigData;

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
  const data = await uploadRes.json() as { secure_url: string };
  return data.secure_url;
}
