import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"
import Link from "next/link"

export default function CampaignNotFound() {
  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <FileQuestion className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Campaign Not Found</h2>
            <p className="text-muted-foreground">The campaign you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button asChild className="mt-4">
            <Link href="/dashboard/campaigns">Back to Campaigns</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
