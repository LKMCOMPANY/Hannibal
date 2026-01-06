import { notFound } from "next/navigation"
import { getArticleWithRelations } from "@/lib/data/articles"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params
  const article = await getArticleWithRelations(Number.parseInt(id))

  if (!article) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">{article.title}</h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Article details and preview (edit functionality coming in publication module)
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Article ID: {article.id} - Full article view and editing will be implemented in the publication module.
        </p>
      </div>
    </div>
  )
}
