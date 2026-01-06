"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Send, ThumbsUp, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDictionary } from "@/lib/i18n"

type Comment = {
  id: number
  author: string
  avatar?: string
  content: string
  timestamp: string
  likes: number
}

type CommentsSectionProps = {
  articleId: number
  initialComments?: Comment[]
}

export function CommentsSection({ articleId, initialComments = [] }: CommentsSectionProps) {
  const { t, locale } = useDictionary()

  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 500))

    const comment: Comment = {
      id: Date.now(),
      author: "Guest User",
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
    setIsSubmitting(false)
  }

  return (
    <section
      className="mt-12 border p-6"
      style={{
        backgroundColor: "var(--theme-current-surface)",
        borderColor: "var(--theme-current-border)",
        borderRadius: "var(--theme-radius-card)",
        boxShadow: "var(--theme-shadow-card)",
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
            borderRadius: "var(--theme-radius-button)",
            width: "2.5rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageSquare className="h-5 w-5" style={{ color: "var(--theme-current-primary)" }} />
        </div>
        <div>
          <h2
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--theme-font-heading)",
              color: "var(--theme-current-text-primary)",
            }}
          >
            {t("comments.title")}
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--theme-font-body)",
              color: "var(--theme-current-text-muted)",
            }}
          >
            {t("comments.count", { count: comments.length.toString() })}
          </p>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Textarea
          placeholder={t("comments.placeholder")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-none"
          style={{
            backgroundColor: "var(--theme-current-background)",
            borderColor: "var(--theme-current-border)",
            color: "var(--theme-current-text-primary)",
            borderRadius: "var(--theme-radius-input)",
          }}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="gap-2"
            style={{
              backgroundColor: "var(--theme-current-primary)",
              color: "white",
              borderRadius: "var(--theme-radius-button)",
            }}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? t("action.posting") : t("action.postComment")}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div
            className="p-8 text-center"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-current-surface) 50%, var(--theme-current-background))",
              borderRadius: "var(--theme-radius-card)",
            }}
          >
            <MessageSquare
              className="mx-auto mb-3 h-12 w-12"
              style={{
                color: "var(--theme-current-text-muted)",
                opacity: 0.5,
              }}
            />
            <p
              className="text-sm"
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-muted)",
              }}
            >
              {t("comments.empty")}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 border-b pb-6 last:border-0 last:pb-0"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-current-border) 40%, transparent)",
              }}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="font-semibold text-sm"
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      color: "var(--theme-current-text-primary)",
                    }}
                  >
                    {comment.author}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      color: "var(--theme-current-text-muted)",
                    }}
                  >
                    {new Date(comment.timestamp).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    color: "var(--theme-current-text-secondary)",
                  }}
                >
                  {comment.content}
                </p>

                <div className="flex items-center gap-4 pt-1">
                  <button
                    className="flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-[var(--theme-current-primary)]"
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      color: "var(--theme-current-text-muted)",
                    }}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-[var(--theme-current-primary)]"
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      color: "var(--theme-current-text-muted)",
                    }}
                  >
                    <Reply className="h-3.5 w-3.5" />
                    <span>{t("action.reply")}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
