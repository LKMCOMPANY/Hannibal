import { PublishFormSkeleton } from "@/components/publish/publish-form-skeleton"

export default function PublishLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="typography-h1 text-balance">Publish Article</h1>
          <p className="typography-muted text-pretty">Create and publish a new article</p>
        </div>
      </div>

      <PublishFormSkeleton />
    </div>
  )
}
