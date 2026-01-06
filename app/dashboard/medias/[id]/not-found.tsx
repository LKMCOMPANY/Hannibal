import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="typography-h3">Media Not Found</h2>
            <p className="typography-muted">The media you're looking for doesn't exist or has been removed.</p>
          </div>
          <Link href="/dashboard/medias" className="w-full">
            <Button className="w-full">Back to Medias</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
