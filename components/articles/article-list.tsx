import { ArticleCard } from "./article-card"
import type { ArticleListItem } from "@/lib/types/articles"

type ArticleListProps = {
  articles: ArticleListItem[]
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No articles found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
