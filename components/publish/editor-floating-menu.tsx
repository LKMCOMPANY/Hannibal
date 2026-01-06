"use client"

import { FloatingMenu } from "@tiptap/react/menus"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  ImageIcon,
  Youtube,
  FileCode,
  Minus,
} from "lucide-react"
import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type EditorFloatingMenuProps = {
  editor: Editor
}

export function EditorFloatingMenu({ editor }: EditorFloatingMenuProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [codeBlockDialogOpen, setCodeBlockDialogOpen] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState("plaintext")

  const addImage = useCallback(() => {
    if (!editor || imageUrl === "") return

    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()

    setImageDialogOpen(false)
    setImageUrl("")
    setImageAlt("")
  }, [editor, imageUrl, imageAlt])

  const addYoutube = useCallback(() => {
    if (!editor || youtubeUrl === "") return

    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()

    setYoutubeDialogOpen(false)
    setYoutubeUrl("")
  }, [editor, youtubeUrl])

  const addCodeBlock = useCallback(() => {
    if (!editor) return

    editor.chain().focus().setCodeBlock({ language: codeLanguage }).run()

    setCodeBlockDialogOpen(false)
    setCodeLanguage("plaintext")
  }, [editor, codeLanguage])

  return (
    <>
      <FloatingMenu
        editor={editor}
        tippyOptions={{
          duration: 150,
          placement: "left",
          offset: [0, 8],
        }}
        className="flex items-center rounded-lg border border-border bg-background shadow-lg ring-1 ring-black/5 dark:ring-white/10"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent">
              <Plus className="size-4" />
              <span className="sr-only">Insert block</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Text</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="mr-2 size-4" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="mr-2 size-4" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="mr-2 size-4" />
              Heading 3
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Lists</DropdownMenuLabel>

            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleBulletList().run()}>
              <List className="mr-2 size-4" />
              Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered className="mr-2 size-4" />
              Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleTaskList().run()}>
              <ListTodo className="mr-2 size-4" />
              Task List
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Blocks</DropdownMenuLabel>

            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="mr-2 size-4" />
              Quote
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().setHorizontalRule().run()}>
              <Minus className="mr-2 size-4" />
              Divider
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Media</DropdownMenuLabel>

            <DropdownMenuItem onSelect={() => setImageDialogOpen(true)}>
              <ImageIcon className="mr-2 size-4" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setYoutubeDialogOpen(true)}>
              <Youtube className="mr-2 size-4" />
              YouTube
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setCodeBlockDialogOpen(true)}>
              <FileCode className="mr-2 size-4" />
              Code Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </FloatingMenu>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
            <DialogDescription>Enter the image URL and optional alt text for accessibility.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="floating-image-url">Image URL</Label>
              <Input
                id="floating-image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floating-image-alt">Alt Text (optional)</Label>
              <Input
                id="floating-image-alt"
                placeholder="Description of the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addImage()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addImage}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Embed YouTube Video</DialogTitle>
            <DialogDescription>
              Enter a YouTube video URL. Supports both youtube.com and youtu.be links.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="floating-youtube-url">YouTube URL</Label>
              <Input
                id="floating-youtube-url"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addYoutube()
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYoutubeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addYoutube}>Embed Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Block Dialog */}
      <Dialog open={codeBlockDialogOpen} onOpenChange={setCodeBlockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Code Block</DialogTitle>
            <DialogDescription>Select a programming language for syntax highlighting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="floating-code-language">Language</Label>
              <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                <SelectTrigger id="floating-code-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plaintext">Plain Text</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="jsx">JSX</SelectItem>
                  <SelectItem value="tsx">TSX</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="swift">Swift</SelectItem>
                  <SelectItem value="kotlin">Kotlin</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="scss">SCSS</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="shell">Shell</SelectItem>
                  <SelectItem value="powershell">PowerShell</SelectItem>
                  <SelectItem value="docker">Docker</SelectItem>
                  <SelectItem value="graphql">GraphQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCodeBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCodeBlock}>Insert Code Block</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
