"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AuthorForm } from "./author-form"
import { CreateAuthorDialog } from "./create-author-dialog"
import { deleteAuthorAction } from "@/lib/actions/authors"
import type { Author } from "@/lib/types/authors"

type AuthorsTabProps = {
  authors: Author[]
  siteId: number
}

export function AuthorsTab({ authors, siteId }: AuthorsTabProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (author: Author) => {
    setAuthorToDelete(author)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!authorToDelete) return

    setIsDeleting(true)
    const result = await deleteAuthorAction(authorToDelete.id, siteId)

    if (result.success) {
      toast.success("Success", {
        description: "Author deleted successfully",
      })
      setDeleteDialogOpen(false)
      setAuthorToDelete(null)
    } else {
      toast.error("Error", {
        description: result.error || "Failed to delete author",
      })
    }
    setIsDeleting(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="typography-small text-muted-foreground">
            {authors.length} {authors.length === 1 ? "author" : "authors"}
          </p>
        </div>
        <CreateAuthorDialog siteId={siteId} />
      </div>

      {authors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12">
          <p className="typography-muted mb-4">No authors yet</p>
          <CreateAuthorDialog siteId={siteId} />
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {authors.map((author) => (
            <AccordionItem
              key={author.id}
              value={`author-${author.id}`}
              className="rounded-lg border border-border bg-card shadow-sm"
            >
              <AccordionTrigger className="px-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex flex-col items-start gap-1 text-left">
                    <span className="typography-base font-medium">
                      {author.first_name} {author.last_name}
                    </span>
                    <span className="typography-small text-muted-foreground">{author.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(author)
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-4">
                <AuthorForm author={author} siteId={siteId} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Author</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {authorToDelete?.first_name} {authorToDelete?.last_name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
