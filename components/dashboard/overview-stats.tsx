import { Card, CardContent } from "@/components/ui/card"
import { Newspaper, Globe2, Languages, Twitter } from "lucide-react"

type OverviewStatsProps = {
  stats: {
    activeMedias: number
    activeCountries: number
    activeLanguages: number
    xPosts: number
  }
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  const statCards = [
    {
      label: "Medias",
      value: stats.activeMedias,
      icon: Newspaper,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Countries",
      value: stats.activeCountries,
      icon: Globe2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Languages",
      value: stats.activeLanguages,
      icon: Languages,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "X Posts",
      value: stats.xPosts,
      icon: Twitter,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.label} 
            className="group overflow-hidden border-border transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className={`shrink-0 rounded-lg ${stat.bgColor} p-2 transition-transform duration-200 group-hover:scale-110 ${stat.color}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-[10px] font-medium uppercase leading-tight tracking-wider text-muted-foreground sm:text-xs">
                    {stat.label}
                  </p>
                  <p className="truncate text-xl font-bold tabular-nums text-foreground sm:text-2xl lg:text-3xl">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
