"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { useEffect } from "react"
import { defaultExtensions } from "@/lib/extensions"
import { cn } from "@/lib/utils"
import { EditorToolbar } from "./editor-toolbar"
import { EditorBubbleMenu } from "./editor-bubble-menu"
import { EditorFloatingMenu } from "./editor-floating-menu"

type TiptapEditorProps = {
  initialContent?: string
  onUpdate: (content: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({
  initialContent = "",
  onUpdate,
  placeholder = "Write your article content here...",
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: defaultExtensions,
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "article-content",
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none",
          "prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20",
          "prose-h1:text-4xl prose-h1:leading-tight prose-h1:mb-6",
          "prose-h2:text-3xl prose-h2:leading-snug prose-h2:mt-12 prose-h2:mb-4",
          "prose-h3:text-2xl prose-h3:leading-snug prose-h3:mt-8 prose-h3:mb-3",
          "prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-a:underline-offset-4 prose-a:decoration-2",
          "prose-strong:text-foreground prose-strong:font-semibold",
          "prose-em:text-foreground prose-em:italic",
          "prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-border prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
          "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:shadow-sm",
          "prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-6",
          "prose-hr:border-border prose-hr:my-8",
          "prose-ul:list-disc prose-ul:my-6 prose-ol:list-decimal prose-ol:my-6",
          "prose-li:text-foreground prose-li:my-2 prose-li:marker:text-muted-foreground",
          "prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:shadow-sm prose-img:my-8",
          "prose-video:rounded-xl prose-video:border prose-video:border-border prose-video:shadow-sm prose-video:my-8",
          "focus:outline-none min-h-[500px] px-8 py-12 sm:px-12 lg:px-16",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onUpdate(html)
    },
  })

  useEffect(() => {
    if (editor && initialContent !== undefined) {
      const currentContent = editor.getHTML()
      // Only update if content is different to avoid cursor jumps
      if (currentContent !== initialContent) {
        editor.commands.setContent(initialContent, false)
      }
    }
  }, [editor, initialContent])

  const characters = editor?.storage.characterCount.characters() || 0
  const words = editor?.storage.characterCount.words() || 0

  return (
    <div className={cn("rounded-xl overflow-hidden bg-background shadow-sm", className)}>
      <EditorToolbar editor={editor} />
      <div className="relative bg-background">
        {editor && (
          <>
            <EditorBubbleMenu editor={editor} />
            <EditorFloatingMenu editor={editor} />
          </>
        )}
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span className="font-medium">
            {words} {words === 1 ? "word" : "words"}
          </span>
          <span className="text-border">•</span>
          <span className="font-medium">
            {characters} {characters === 1 ? "character" : "characters"}
          </span>
        </div>
      </div>
    </div>
  )
}
