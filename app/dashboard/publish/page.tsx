import { Suspense } from "react"
import { PublishForm } from "@/components/publish/publish-form"
import { PublishFormSkeleton } from "@/components/publish/publish-form-skeleton"
import { getSites } from "@/lib/data/sites"

export default async function PublishPage() {
  const sites = await getSites()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="typography-h1 text-balance">Publish Article</h1>
        <p className="typography-muted text-pretty">Create and publish a new article</p>
      </div>

      <Suspense fallback={<PublishFormSkeleton />}>
        <PublishForm sites={sites} />
      </Suspense>
    </div>
  )
}
