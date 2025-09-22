"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { LeaderboardStats } from "@/components/leaderboard-stats"
import { calculateLeaderboard, getLeaderboardStats } from "@/lib/leaderboard"

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("all")

  const leaderboardData = calculateLeaderboard(selectedPeriod)
  const stats = getLeaderboardStats()

  const periods = [
    { value: "week" as const, label: "This Week" },
    { value: "month" as const, label: "This Month" },
    { value: "all" as const, label: "All Time" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the top builders in the BUILDRS community. Rankings are based on builder score, community
              upvotes, and build streaks.
            </p>
          </div>

          {/* Stats */}
          <LeaderboardStats {...stats} />

          {/* Period Selection */}
          <div className="flex justify-center">
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <LeaderboardTable
            entries={leaderboardData}
            period={periods.find((p) => p.value === selectedPeriod)?.label || "All Time"}
          />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Rankings update every hour. Final Score = (Builder Score × 0.6) + (Total Upvotes × 0.3) + (Streak Bonus ×
              0.1)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
