import { MediaCard } from "./media-card"
import type { Site } from "@/lib/types/sites"

type MediaListProps = {
  medias: Site[]
  filters?: {
    search?: string
    country?: string
    status?: string
    ideology?: string
  }
}

export function MediaList({ medias, filters }: MediaListProps) {
  if (medias.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="typography-h3 mb-2">No medias found</h3>
          <p className="typography-muted mb-4">
            {filters?.search || filters?.country || filters?.status || filters?.ideology
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by creating your first media site."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="typography-small text-muted-foreground">
        {medias.length} {medias.length === 1 ? "media" : "medias"} found
      </p>
      <div className="space-y-4">
        {medias.map((media) => (
          <MediaCard key={media.id} media={media} />
        ))}
      </div>
    </div>
  )
}
