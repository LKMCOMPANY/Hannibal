import { format } from "date-fns"
import { Calendar, CheckCircle2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type ReportHeaderProps = {
  campaign: any
}

export function ReportHeader({ campaign }: ReportHeaderProps) {
  const statusConfig = {
    completed: { label: "Completed", className: "bg-green-500/10 text-green-700 dark:text-green-400" },
    processing: { label: "Processing", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
    pending: { label: "Pending", className: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
  }[campaign.status] || { label: campaign.status, className: "" }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {campaign.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Campaign Report
          </p>
        </div>
        <Badge variant="secondary" className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Created {format(new Date(campaign.created_at), "MMM d, yyyy")}</span>
        </div>
        {campaign.completed_at && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Completed {format(new Date(campaign.completed_at), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>

      {campaign.source_article_title && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground">Source Article</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{campaign.source_article_title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {campaign.source_site_name && <span>{campaign.source_site_name}</span>}
            {campaign.source_custom_domain && campaign.source_article_slug && (
              <>
                <span>•</span>
                <a
                  href={`https://${campaign.source_custom_domain}/article/${campaign.source_article_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View article
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

