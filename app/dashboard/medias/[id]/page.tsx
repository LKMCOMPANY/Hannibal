import { getSiteById } from "@/lib/data/sites"
import { getAuthorsBySiteId } from "@/lib/data/authors"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MediaEditForm } from "@/components/medias/media-edit-form"

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const media = await getSiteById(Number(id))

  if (!media) {
    notFound()
  }

  const authors = await getAuthorsBySiteId(media.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/medias">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="typography-h1 text-balance">{media.name}</h1>
        <p className="typography-muted mt-2">Edit media details and configuration</p>
      </div>

      <MediaEditForm media={media} authors={authors} />
    </div>
  )
}
