import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Code, TrendingUp, Zap } from "lucide-react"

interface LeaderboardStatsProps {
  totalBuilders: number
  totalBuilds: number
  totalUpvotes: number
  activeBuilders: number
}

export function LeaderboardStats({ totalBuilders, totalBuilds, totalUpvotes, activeBuilders }: LeaderboardStatsProps) {
  const stats = [
    {
      title: "Total Builders",
      value: totalBuilders.toLocaleString(),
      icon: Users,
      description: "Registered builders",
    },
    {
      title: "Total Builds",
      value: totalBuilds.toLocaleString(),
      icon: Code,
      description: "Projects shared",
    },
    {
      title: "Total Upvotes",
      value: totalUpvotes.toLocaleString(),
      icon: TrendingUp,
      description: "Community appreciation",
    },
    {
      title: "Active This Week",
      value: activeBuilders.toLocaleString(),
      icon: Zap,
      description: "Builders with activity",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
