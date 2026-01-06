import { Suspense } from "react"
import { MediaList } from "@/components/medias/media-list"
import { MediaListSkeleton } from "@/components/medias/media-list-skeleton"
import { MediaSearch } from "@/components/medias/media-search"
import { CreateMediaDialog } from "@/components/medias/create-media-dialog"
import { getSites } from "@/lib/data/sites"

export default async function MediasPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; country?: string; status?: string; ideology?: string }>
}) {
  const params = await searchParams
  const medias = await getSites(params)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="typography-h1 text-balance">Medias</h1>
          <p className="typography-muted mt-2">Manage your media sites and publications</p>
        </div>
        <CreateMediaDialog />
      </div>

      <MediaSearch />

      <Suspense fallback={<MediaListSkeleton />}>
        <MediaList medias={medias} filters={params} />
      </Suspense>
    </div>
  )
}
