import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { LeaderboardEntry } from "@/lib/leaderboard"

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  period: string
}

export function LeaderboardTable({ entries, period }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
            {rank}
          </span>
        )
    }
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return "bg-primary/10 text-primary border-primary/20"
    if (rank <= 10) return "bg-secondary/10 text-secondary-foreground border-secondary/20"
    return "bg-muted/10 text-muted-foreground border-muted/20"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Top Builders - {period}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getRankIcon(entry.rank)}
                <Badge variant="outline" className={getRankBadgeColor(entry.rank)}>
                  #{entry.rank}
                </Badge>
              </div>

              <Avatar className="w-12 h-12">
                <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{entry.displayName}</h3>
                  <span className="text-sm text-muted-foreground">@{entry.username}</span>
                </div>
                {entry.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{entry.bio}</p>}
              </div>

              <div className="text-right space-y-1">
                <div className="text-lg font-bold text-primary">{entry.finalScore}</div>
                <div className="text-xs text-muted-foreground">Final Score</div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-sm font-medium">{entry.builderScore}</div>
                <div className="text-xs text-muted-foreground">Builder Score</div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-sm font-medium">{entry.totalUpvotes}</div>
                <div className="text-xs text-muted-foreground">Upvotes</div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-sm font-medium">{entry.buildStreak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/profile/${entry.username}`}>View Profile</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
