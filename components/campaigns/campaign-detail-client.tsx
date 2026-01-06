"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Trash2, ExternalLink } from "lucide-react"
import { CampaignDetail } from "@/components/campaigns/campaign-detail"
import { CampaignPublications } from "@/components/campaigns/campaign-publications"
import { CampaignProgress } from "@/components/campaigns/campaign-progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"
import { deleteCampaignWithArticlesAction } from "@/lib/actions/campaigns"
import { generateCampaignReportAction } from "@/lib/actions/campaign-report"

type CampaignDetailClientProps = {
  campaignId: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CampaignDetailClient({ campaignId }: CampaignDetailClientProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const { data, error, isLoading } = useSWR(`/api/campaigns/${campaignId}/status`, fetcher, {
    refreshInterval: (data) => {
      return data?.campaign?.status === "processing" ? 3000 : 0
    },
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  useEffect(() => {
    if (data?.campaign?.status === "completed" || data?.campaign?.status === "failed") {
      router.refresh()
    }
  }, [data?.campaign?.status, router])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !data?.campaign) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Campaign not found</p>
          <p className="mt-1 text-sm text-muted-foreground">The campaign you're looking for doesn't exist</p>
        </div>
      </div>
    )
  }

  const { campaign, publications } = data
  const isProcessing = campaign.status === "processing"

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteCampaignWithArticlesAction(campaignId)

      if (result.success) {
        toast.success(
          `Campaign deleted successfully${result.deletedArticles ? ` (${result.deletedArticles} article${result.deletedArticles > 1 ? "s" : ""} removed)` : ""}`,
        )
        router.push("/dashboard/campaigns")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete campaign")
        setIsDeleting(false)
      }
    } catch (error) {
      console.error("[v0] Error deleting campaign:", error)
      toast.error("An unexpected error occurred")
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{campaign.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Campaign details and deployment status</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setIsGeneratingReport(true)
              const result = await generateCampaignReportAction(campaignId)
              if (result.success && result.data) {
                // Use location.href for mobile Safari compatibility (no popup blocker)
                window.location.href = result.data
              } else {
                toast.error(result.error || "Failed to generate report")
                setIsGeneratingReport(false)
              }
            }}
            disabled={isGeneratingReport}
            className="w-full sm:w-auto"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {isGeneratingReport ? "Opening..." : "View Report"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <CampaignProgress campaign={campaign} isLive={isProcessing} />

      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="publications">Publications ({publications.length})</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="publications" className="mt-6">
          <CampaignPublications publications={publications} />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <CampaignDetail campaign={campaign} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription className="text-pretty">
              Are you sure you want to delete "{campaign.name}"? This will permanently delete the campaign and all{" "}
              {publications.length} published article{publications.length !== 1 ? "s" : ""}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
