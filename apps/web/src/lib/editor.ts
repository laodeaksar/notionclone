import { Editor, Extension, Mark, Node, mergeAttributes } from "@tiptap/core";
import { TextSelection } from "prosemirror-state";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
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
  {
    title: "Image",
    description: "Upload an image from your computer",
    icon: "image",
    command: (ed) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpeg,image/gif,image/webp";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const url = await uploadImage(file);
          ed.chain().focus().insertContent({
            type: "image",
            attrs: { src: url, align: "center" },
          }).run();
        } catch (err) {
          console.error("Image upload failed", err);
        }
      };
      input.click();
    },
  },
  {
    title: "Callout",
    description: "Highlighted note block",
    icon: "lightbulb",
    command: (e) =>
      e.chain().focus().insertContent({
        type: "callout",
        attrs: { variant: "default" },
        content: [{ type: "paragraph" }],
      }).run(),
  },
  {
    title: "Info",
    description: "Informational callout",
    icon: "info",
    command: (e) =>
      e.chain().focus().insertContent({
        type: "callout",
        attrs: { variant: "info" },
        content: [{ type: "paragraph" }],
      }).run(),
  },
  {
    title: "Warning",
    description: "Warning callout",
    icon: "alert-triangle",
    command: (e) =>
      e.chain().focus().insertContent({
        type: "callout",
        attrs: { variant: "warning" },
        content: [{ type: "paragraph" }],
      }).run(),
  },
  {
    title: "Success",
    description: "Success callout",
    icon: "check-circle",
    command: (e) =>
      e.chain().focus().insertContent({
        type: "callout",
        attrs: { variant: "success" },
        content: [{ type: "paragraph" }],
      }).run(),
  },
];

// ── Slash menu reactive state (writable store) ────────────────────────────────

export interface SlashMenuState {
  open: boolean;
  items: SlashItem[];
  selectedIndex: number;
  /** Raw clientRect accessor from @tiptap/suggestion — used as floating-ui virtual reference. */
  rect: (() => DOMRect | null | undefined) | null;
  /** The editor's ProseMirror DOM element — gives autoUpdate an ancestor to track scroll on. */
  contextElement: Element | null;
  executeCommand: ((item: SlashItem) => void) | null;
}

export const slashMenuStore = writable<SlashMenuState>({
  open: false,
  items: [],
  selectedIndex: 0,
  rect: null,
  contextElement: null,
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

// ── Custom Blockquote with author attribution ─────────────────────────────────

export const CustomBlockquote = Blockquote.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Enter: ({ editor }) => {
        const { $from, empty } = editor.state.selection;
        let blockquoteDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === "blockquote") {
            blockquoteDepth = d;
            break;
          }
        }
        if (blockquoteDepth === -1) return false;

        const currentNode = $from.node($from.depth);
        const isEmptyParagraph =
          empty && currentNode.type.name === "paragraph" && currentNode.content.size === 0;

        if (isEmptyParagraph) {
          const { state, view } = editor;
          const { tr, schema } = state;
          const paraStart = $from.before($from.depth);
          const paraEnd = $from.after($from.depth);
          const bqEnd = $from.before(blockquoteDepth) + $from.node(blockquoteDepth).nodeSize;
          const newPara = schema.nodes.paragraph.create();
          tr.delete(paraStart, paraEnd).insert(tr.mapping.map(bqEnd), newPara);
          const landingPos = tr.mapping.map(bqEnd) + 1;
          tr.setSelection(TextSelection.near(tr.doc.resolve(landingPos)));
          view.dispatch(tr);
          return true;
        }

        return editor.commands.splitBlock();
      },
      "Shift-Enter": ({ editor }) => {
        const { $from } = editor.state.selection;
        let blockquoteDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === "blockquote") {
            blockquoteDepth = d;
            break;
          }
        }
        if (blockquoteDepth === -1) return false;

        const bqNode = $from.node(blockquoteDepth);
        const afterBlockquote = $from.before(blockquoteDepth) + bqNode.nodeSize;
        return editor.chain()
          .insertContentAt(afterBlockquote, { type: "paragraph" })
          .setTextSelection(afterBlockquote + 1)
          .run();
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      author: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-author") ?? "",
        renderHTML: (attrs) =>
          attrs.author ? { "data-author": attrs.author as string } : {},
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor: ed }) => {
      let currentAttrs = { ...node.attrs };

      const figure = document.createElement("figure");
      figure.className = "blockquote-figure";

      const bq = document.createElement("blockquote");
      bq.className = "blockquote-figure__content";

      const cite = document.createElement("cite");
      cite.contentEditable = "true";
      cite.dataset.placeholder = "Tambahkan sumber…";
      cite.className = "blockquote-figure__author";
      cite.textContent = (currentAttrs.author as string) ?? "";

      figure.appendChild(bq);
      figure.appendChild(cite);

      function commitAuthor() {
        const pos = typeof getPos === "function" ? getPos() : undefined;
        if (pos === undefined) return;
        const author = (cite.innerText || cite.textContent || "")
          .replace(/\n/g, " ")
          .trim();
        // Go through Tiptap command pipeline so onUpdate fires reliably
        ed.commands.command(({ tr, state }) => {
          const node = state.doc.nodeAt(pos);
          if (!node || node.type.name !== "blockquote") return false;
          if (node.attrs.author === author) return false;
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, author });
          return true;
        });
      }

      cite.addEventListener("input", commitAuthor);
      cite.addEventListener("blur", commitAuthor);

      cite.addEventListener("keydown", (e) => {
        // Prevent newlines inside the author field
        if (e.key === "Enter") { e.preventDefault(); cite.blur(); }
        if (e.key === "Escape") cite.blur();
        e.stopPropagation();
      });

      return {
        dom: figure,
        contentDOM: bq,

        update(updatedNode) {
          if (updatedNode.type.name !== "blockquote") return false;
          currentAttrs = { ...updatedNode.attrs };
          if (!cite.matches(":focus")) {
            cite.textContent = (currentAttrs.author as string) ?? "";
          }
          return true;
        },

        stopEvent(event) {
          return cite.contains(event.target as Node);
        },

        ignoreMutation(mutation) {
          return cite.contains(mutation.target as Node);
        },
      };
    };
  },
});

// ── Callout block ─────────────────────────────────────────────────────────────

const CALLOUT_SVG_PATHS: Record<string, string> = {
  default: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
  info:    `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`,
  warning: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
  success: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`,
  error:   `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>`,
};

function makeCalloutSVG(variant: string): string {
  const paths = CALLOUT_SVG_PATHS[variant] ?? CALLOUT_SVG_PATHS.default;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export const CalloutExtension = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "default",
        parseHTML: (el) => el.getAttribute("data-callout-variant") ?? "default",
        renderHTML: (attrs) => ({ "data-callout-variant": attrs.variant }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout-variant]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ class: "callout" }, HTMLAttributes), 0];
  },

  addNodeView() {
    return ({ node }) => {
      let variant = (node.attrs.variant as string) ?? "default";

      const wrapper = document.createElement("div");
      wrapper.className = `callout callout--${variant}`;

      const iconEl = document.createElement("span");
      iconEl.className = "callout__icon";
      iconEl.innerHTML = makeCalloutSVG(variant);

      const contentEl = document.createElement("div");
      contentEl.className = "callout__content";

      wrapper.appendChild(iconEl);
      wrapper.appendChild(contentEl);

      return {
        dom: wrapper,
        contentDOM: contentEl,

        update(updatedNode) {
          if (updatedNode.type.name !== "callout") return false;
          variant = (updatedNode.attrs.variant as string) ?? "default";
          wrapper.className = `callout callout--${variant}`;
          iconEl.innerHTML = makeCalloutSVG(variant);
          return true;
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
              slashMenuStore.set({
                open: true,
                items: localItems,
                selectedIndex: 0,
                rect: props.clientRect ?? null,
                contextElement: editor.view.dom,
                executeCommand: (item) => localCommand?.(item),
              });
            },

            onUpdate(props: any) {
              localItems = props.items as SlashItem[];
              localCommand = props.command;
              selectedIndex = 0;
              slashMenuStore.update((s) => ({
                ...s,
                items: localItems,
                selectedIndex: 0,
                rect: props.clientRect ?? s.rect,
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
      StarterKit.configure({ blockquote: false }),
      CustomBlockquote,
      CustomImage.configure({ allowBase64: true }),
      CalloutExtension,
      Placeholder.configure({ placeholder }),
      Typography.configure({
        // Disable em-dash so "---" fires the horizontal-rule input rule
        // instead of being converted to "—" + "-" by Typography first.
        emDash: false,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
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
