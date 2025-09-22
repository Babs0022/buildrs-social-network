"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"
import { calculateVoteState, handleVote, type VoteType } from "@/lib/voting"
import { cn } from "@/lib/utils"

interface VoteButtonsProps {
  buildId: string
  initialUpvotes: number
  initialDownvotes: number
  className?: string
}

export function VoteButtons({ buildId, initialUpvotes, initialDownvotes, className }: VoteButtonsProps) {
  const [voteState, setVoteState] = useState(() => calculateVoteState(buildId, initialUpvotes, initialDownvotes))

  const onVote = (voteType: VoteType) => {
    const newState = handleVote(buildId, voteType, voteState)
    setVoteState(newState)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "h-8 px-2 hover:bg-green-500/10",
          voteState.userVote === "upvote" && "bg-green-500/10 text-green-400",
        )}
        onClick={() => onVote("upvote")}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[2ch] text-center">{voteState.upvotes}</span>
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "h-8 px-2 hover:bg-red-500/10",
          voteState.userVote === "downvote" && "bg-red-500/10 text-red-400",
        )}
        onClick={() => onVote("downvote")}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
