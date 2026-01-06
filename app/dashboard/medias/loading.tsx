import { MediaSearch } from "@/components/medias/media-search"
import { MediaListSkeleton } from "@/components/medias/media-list-skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Medias</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your media sites</p>
        </div>
      </div>

      <MediaSearch />
      <MediaListSkeleton />
    </div>
  )
}
