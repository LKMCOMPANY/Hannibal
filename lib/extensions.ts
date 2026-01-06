import { StarterKit } from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"
import { TaskList } from "@tiptap/extension-task-list"
import { TaskItem } from "@tiptap/extension-task-item"
import { Underline } from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { TextAlign } from "@tiptap/extension-text-align"
import { Highlight } from "@tiptap/extension-highlight"
import { Youtube } from "@tiptap/extension-youtube"
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { CharacterCount } from "@tiptap/extension-character-count"
import { common, createLowlight } from "lowlight"
import { cx } from "class-variance-authority"

const lowlight = createLowlight(common)

const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs.level}`
    }
    return "Write your article content here..."
  },
  includeChildren: true,
})

const tiptapLink = Link.configure({
  HTMLAttributes: {
    class: cx("text-primary underline underline-offset-[3px] hover:text-primary/80 transition-colors cursor-pointer"),
  },
  openOnClick: false,
})

const tiptapImage = Image.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-border max-w-full h-auto"),
  },
  inline: false,
  allowBase64: true,
})

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 space-y-2"),
  },
})

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex items-start gap-2"),
  },
  nested: true,
})

const youtube = Youtube.configure({
  width: 640,
  height: 480,
  controls: true,
  nocookie: true,
  allowFullscreen: true,
  autoplay: false,
  HTMLAttributes: {
    class: cx("rounded-lg border border-border overflow-hidden my-4 mx-auto max-w-full"),
  },
})

const codeBlockLowlight = CodeBlockLowlight.configure({
  lowlight,
  HTMLAttributes: {
    class: cx(
      "rounded-lg bg-muted border border-border p-4 font-mono text-sm overflow-x-auto",
      "not-prose relative",
      "[&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent",
      "[&_code]:bg-transparent [&_code]:p-0 [&_code]:text-sm [&_code]:font-mono",
    ),
  },
  defaultLanguage: "plaintext",
})

const starterKit = StarterKit.configure({
  codeBlock: false,
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-relaxed ml-4 space-y-1"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-relaxed ml-4 space-y-1"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-relaxed"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary pl-4 italic text-muted-foreground"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded bg-muted px-1.5 py-0.5 font-mono text-sm border border-border"),
      spellcheck: "false",
    },
  },
  horizontalRule: {
    HTMLAttributes: {
      class: cx("my-6 border-t border-border"),
    },
  },
  heading: {
    levels: [1, 2, 3, 4, 5, 6],
    HTMLAttributes: {
      class: cx("font-bold tracking-tight"),
    },
  },
  paragraph: {
    HTMLAttributes: {
      class: cx("leading-relaxed"),
    },
  },
  dropcursor: {
    color: "hsl(var(--primary))",
    width: 2,
  },
})

const textAlign = TextAlign.configure({
  types: ["heading", "paragraph"],
  alignments: ["left", "center", "right", "justify"],
})

const highlight = Highlight.configure({
  multicolor: true,
  HTMLAttributes: {
    class: cx("bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded"),
  },
})

const characterCount = CharacterCount.configure({
  limit: null,
})

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  taskList,
  taskItem,
  Underline,
  TextStyle,
  Color,
  textAlign,
  highlight,
  youtube,
  codeBlockLowlight,
  characterCount,
]
