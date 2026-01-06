import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-12 w-48" />
        <Skeleton className="mx-auto h-4 w-32" />
      </div>
    </div>
  )
}
