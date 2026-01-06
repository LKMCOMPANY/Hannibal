import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ArticleNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold text-foreground">Article Not Found</h2>
      <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
      <Button asChild>
        <Link href="/dashboard/articles">Back to Articles</Link>
      </Button>
    </div>
  )
}
