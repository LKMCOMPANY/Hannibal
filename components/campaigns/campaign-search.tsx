"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useCallback, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

type CampaignSearchProps = {
  statuses: string[]
}

export function CampaignSearch({ statuses }: CampaignSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      startTransition(() => {
        router.push(`/dashboard/campaigns?${params.toString()}`)
      })
    },
    [router, searchParams],
  )

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateSearchParams("search", value)
  }, 300)

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Search campaigns..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        defaultValue={searchParams.get("status") || "all"}
        onValueChange={(value) => updateSearchParams("status", value)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
