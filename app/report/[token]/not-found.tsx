import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function CampaignReportNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Campaign Report Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The report you're looking for doesn't exist or the link has expired.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}

