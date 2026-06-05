import { Editor, Extension, Mark, mergeAttributes } from "@tiptap/core";
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
  shortcut?: string;
  command: (editor: Editor) => void;
}

export const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: "heading-1",
    shortcut: "#",
    command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "heading-2",
    shortcut: "##",
    command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "heading-3",
    shortcut: "###",
    command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Paragraph",
    description: "Plain text block",
    icon: "pilcrow",
    command: (e) => e.chain().focus().setParagraph().run(),
  },
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: "list",
    shortcut: "-",
    command: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Ordered List",
    description: "Numbered list",
    icon: "list-ordered",
    shortcut: "1.",
    command: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Code Block",
    description: "Code snippet",
    icon: "code-2",
    shortcut: "```",
    command: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Blockquote",
    description: "Quote or callout",
    icon: "quote",
    shortcut: ">",
    command: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Divider",
    description: "Horizontal separator",
    icon: "minus",
    shortcut: "---",
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

// ── Comment Mark extension ────────────────────────────────────────────────────

export const CommentMark = Mark.create({
  name: "comment",

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-comment-id"),
        renderHTML: (attrs) =>
          attrs.commentId ? { "data-comment-id": attrs.commentId } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "mark[data-comment-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "mark",
      mergeAttributes({ class: "comment-mark" }, HTMLAttributes),
      0,
    ];
  },
});

// ── Custom Image extension with align + width + caption + pendingId ───────────

const ALIGN_STYLES: Record<string, string> = {
  left: "display:block;margin-left:0;margin-right:auto;",
  center: "display:block;margin-left:auto;margin-right:auto;",
  right: "display:block;margin-left:auto;margin-right:0;",
  "full-width": "display:block;width:100%;",
};

function buildFigureStyle(align: string, width: number | null | undefined) {
  const base = ALIGN_STYLES[align] ?? ALIGN_STYLES.center;
  if (width && align !== "full-width") {
    return base + `max-width:${width}px;width:${width}px;`;
  }
  return base;
}

function syncFigureAttrs(
  figure: HTMLElement,
  img: HTMLImageElement,
  attrs: Record<string, unknown>
) {
  const align = (attrs.align as string) ?? "center";
  const width = attrs.width as number | null | undefined;
  figure.style.cssText = buildFigureStyle(align, width);
  figure.dataset.align = align;

  img.src = (attrs.src as string) ?? "";
  if (attrs.alt) img.alt = attrs.alt as string;
  else img.removeAttribute("alt");
  if (attrs.title) img.title = attrs.title as string;
  else img.removeAttribute("title");

  const pendingId = attrs.pendingId as string | null;
  if (pendingId) img.dataset.pendingId = pendingId;
  else delete img.dataset.pendingId;
}

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        renderHTML: (attrs) => {
          const base = ALIGN_STYLES[attrs.align as string] ?? ALIGN_STYLES.center;
          const widthStyle =
            attrs.width && attrs.align !== "full-width"
              ? `max-width:${attrs.width}px;width:${attrs.width}px;`
              : "";
          return {
            style: base + widthStyle,
            "data-align": attrs.align,
          };
        },
        parseHTML: (el) => el.getAttribute("data-align") ?? "center",
      },
      width: {
        default: null,
        parseHTML: (el) => {
          const v = el.getAttribute("data-width");
          return v ? Number(v) : null;
        },
        renderHTML: (attrs) =>
          attrs.width ? { "data-width": String(attrs.width) } : {},
      },
      caption: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-caption") ?? "",
        renderHTML: (attrs) =>
          attrs.caption ? { "data-caption": attrs.caption as string } : {},
      },
      // Identifies images queued for upload while offline.
      pendingId: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-pending-id") ?? null,
        renderHTML: (attrs) =>
          attrs.pendingId ? { "data-pending-id": attrs.pendingId } : {},
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor: ed }) => {
      let currentAttrs = { ...node.attrs };

      const figure = document.createElement("figure");
      figure.className = "image-figure";

      const img = document.createElement("img");
      img.className = "image-figure__img";

      const captionEl = document.createElement("figcaption");
      captionEl.contentEditable = "true";
      captionEl.dataset.placeholder = "Add a caption…";
      captionEl.className = "image-figure__caption";

      syncFigureAttrs(figure, img, currentAttrs);
      captionEl.textContent = (currentAttrs.caption as string) ?? "";

      figure.appendChild(img);
      figure.appendChild(captionEl);

      captionEl.addEventListener("input", () => {
        const pos = typeof getPos === "function" ? getPos() : undefined;
        if (pos === undefined) return;
        const { tr } = ed.state;
        tr.setNodeMarkup(pos, undefined, {
          ...currentAttrs,
          caption: captionEl.textContent ?? "",
        });
        ed.view.dispatch(tr);
      });

      captionEl.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          captionEl.blur();
        }
        e.stopPropagation();
      });

      return {
        dom: figure,

        update(updatedNode) {
          if (updatedNode.type.name !== "image") return false;
          currentAttrs = { ...updatedNode.attrs };
          syncFigureAttrs(figure, img, currentAttrs);
          if (!captionEl.matches(":focus")) {
            captionEl.textContent = (currentAttrs.caption as string) ?? "";
          }
          return true;
        },

        stopEvent(event) {
          return captionEl.contains(event.target as Node);
        },

        ignoreMutation(mutation) {
          return captionEl.contains(mutation.target as Node);
        },
      };
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

export interface ImageFileResult {
  src: string;
  pendingId?: string | null;
}

export interface CreateEditorOptions {
  element: HTMLElement;
  content?: string | null;
  placeholder?: string;
  onUpdate?: (contentJson: string) => void;
  /** Called for every image file (upload button, drag-drop, paste).
   *  Returns the src to use and an optional pendingId for offline-queued uploads. */
  onImageFile?: (file: File) => Promise<ImageFileResult>;
}

export function createEditor({
  element,
  content,
  placeholder = "Write something, or type / for blocks…",
  onUpdate,
  onImageFile,
}: CreateEditorOptions): Editor {
  let parsedContent: object | null = null;
  if (content) {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = null;
    }
  }

  // Default handler: upload immediately (online-only fallback when no handler provided).
  const handleFile = onImageFile ?? (async (file: File): Promise<ImageFileResult> => {
    const url = await uploadImage(file);
    return { src: url };
  });

  return new Editor({
    element,
    content: parsedContent ?? undefined,
    extensions: [
      StarterKit,
      CustomImage.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder }),
      Typography.configure({
        // Disable em-dash so "---" fires the horizontal-rule input rule
        // instead of being converted to "—" + "-" by Typography first.
        emDash: false,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CommentMark,
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
              const result = await handleFile(file);
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: result.src,
                    align: "center",
                    pendingId: result.pendingId ?? null,
                  },
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
              const result = await handleFile(file);
              currentEditor
                .chain()
                .insertContent({
                  type: "image",
                  attrs: {
                    src: result.src,
                    align: "center",
                    pendingId: result.pendingId ?? null,
                  },
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
