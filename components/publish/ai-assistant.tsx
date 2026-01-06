"use client"

/**
 * AI Assistant Component
 *
 * Provides AI-powered content editing and metadata generation
 * Integrates with TipTap editor and publish form
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Wand2, Languages, FileEdit, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { editContentAction, generateMetadataAction } from "@/lib/ai/actions/redactor-actions"
import type { RedactorOperation } from "@/lib/ai/agents/types"

type AIAssistantProps = {
  content: string
  siteId?: number
  authorId?: number
  slug?: string // Added slug prop for X post URL calculation
  onContentUpdate: (content: string) => void
  onMetadataUpdate?: (metadata: {
    title?: string
    excerpt?: string
    metaDescription?: string
    tags?: string[]
    xPost?: string // Added xPost to metadata update callback
  }) => void
  disabled?: boolean
}

export function AIAssistant({
  content,
  siteId,
  authorId,
  slug, // Destructure slug prop
  onContentUpdate,
  onMetadataUpdate,
  disabled,
}: AIAssistantProps) {
  const [operation, setOperation] = useState<RedactorOperation>("adapt")
  const [customInstructions, setCustomInstructions] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastOperation, setLastOperation] = useState<string | null>(null)

  const handleEditContent = async () => {
    if (!siteId) {
      toast.error("Please select a media first")
      return
    }

    if (!content || content.trim().length === 0) {
      toast.error("Please write some content first")
      return
    }

    setIsProcessing(true)
    setLastOperation(null)

    try {
      const result = await editContentAction({
        content,
        operation,
        siteId,
        authorId,
        additionalInstructions: customInstructions || undefined,
      })

      if (result.success && result.data) {
        onContentUpdate(result.data.editedContent)
        setLastOperation(operation)
        toast.success("Content updated successfully", {
          description: "AI improvements applied with proper formatting",
        })
      } else {
        toast.error("Failed to edit content", {
          description: result.error || "Please try again",
        })
      }
    } catch (error) {
      console.error("[v0] AI assistant error:", error)
      toast.error("An error occurred", {
        description: "Please try again later",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateMetadata = async () => {
    if (!siteId) {
      toast.error("Please select a media first")
      return
    }

    if (!content || content.trim().length === 0) {
      toast.error("Please write some content first")
      return
    }

    setIsProcessing(true)

    try {
      const result = await generateMetadataAction({
        content,
        siteId,
        authorId,
        slug,
      })

      if (result.success && result.data) {
        onMetadataUpdate?.({
          title: result.data.title,
          excerpt: result.data.excerpt,
          metaDescription: result.data.metaDescription,
          tags: result.data.suggestedTags,
          xPost: result.data.xPost, // Pass xPost to parent component
        })
        toast.success("Metadata generated successfully", {
          description: "SEO-optimized metadata created",
        })
      } else {
        toast.error("Failed to generate metadata", {
          description: result.error || "Please try again",
        })
      }
    } catch (error) {
      console.error("[v0] Metadata generation error:", error)
      toast.error("An error occurred", {
        description: "Please try again later",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const operationConfig = {
    adapt: {
      label: "Adapt",
      description: "Reformulate with guidelines and author style",
      icon: FileEdit,
    },
    translate: {
      label: "Translate",
      description: "Translate to media's language",
      icon: Languages,
    },
    develop: {
      label: "Develop",
      description: "Expand with SEO optimization",
      icon: TrendingUp,
    },
  }

  const contentOperations = Object.keys(operationConfig) as Array<keyof typeof operationConfig>

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent shadow-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-balance">AI Assistant</CardTitle>
            <CardDescription className="text-pretty leading-relaxed">
              Enhance your content with AI-powered editing and SEO optimization
            </CardDescription>
          </div>
          {lastOperation && (
            <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success ring-1 ring-success/20">
              <CheckCircle2 className="h-3 w-3" />
              Applied
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Operations Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Content Operations</Label>
            <Tabs value={operation} onValueChange={(value) => setOperation(value as RedactorOperation)}>
              <TabsList className="grid w-full grid-cols-3">
                {contentOperations.map((op) => {
                  const config = operationConfig[op]
                  const Icon = config.icon
                  return (
                    <TabsTrigger
                      key={op}
                      value={op}
                      disabled={disabled || isProcessing}
                      className="flex items-center gap-2 data-[state=active]:shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {operationConfig[operation as keyof typeof operationConfig].description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-instructions" className="text-sm font-medium">
              Additional Instructions
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="custom-instructions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Add specific instructions for the AI..."
              rows={3}
              disabled={disabled || isProcessing}
              className="resize-none text-sm leading-relaxed"
            />
          </div>

          <Button
            onClick={handleEditContent}
            disabled={disabled || isProcessing || !siteId || !content}
            className="w-full gap-2 shadow-sm"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Apply {operationConfig[operation as keyof typeof operationConfig].label}
              </>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Metadata Generation Section */}
        <div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Wand2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-sm font-semibold">Metadata Generation</Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate SEO-optimized title, excerpt, meta description, tags, and X post based on your content
              </p>
            </div>
          </div>
          <Button
            onClick={handleGenerateMetadata}
            disabled={disabled || isProcessing || !siteId || !content}
            variant="outline"
            className="w-full gap-2 bg-background shadow-sm"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Metadata
              </>
            )}
          </Button>
        </div>

        {/* Info Section */}
        {!siteId && (
          <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning/10 p-3.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
            <p className="text-sm text-warning-foreground leading-relaxed">
              Select a media to enable AI assistance. The AI will use the media's language and editorial guidelines
              {authorId && ", plus the selected author's writing style"}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
