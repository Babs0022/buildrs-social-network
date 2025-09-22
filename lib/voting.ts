// Voting system utilities and state management
export type VoteType = "upvote" | "downvote" | null

export interface VoteState {
  upvotes: number
  downvotes: number
  userVote: VoteType
}

import { getUserVote as getFirebaseUserVote, createVote, removeVote } from "@/lib/firebase-db"

export async function getUserVote(buildId: string, userId: string): Promise<VoteType> {
  if (!userId) return null

  const vote = await getFirebaseUserVote(userId, buildId)
  return vote ? vote.voteType : null
}

export async function setUserVote(buildId: string, userId: string, voteType: VoteType) {
  if (!userId) return

  const existingVote = await getFirebaseUserVote(userId, buildId)

  if (existingVote) {
    // Remove existing vote
    await removeVote(existingVote.id, buildId, existingVote.voteType)
  }

  if (voteType !== null) {
    // Add new vote
    await createVote({
      userId,
      buildId,
      voteType,
    })
  }
}

export async function calculateVoteState(
  buildId: string,
  userId: string,
  initialUpvotes: number,
  initialDownvotes: number,
): Promise<VoteState> {
  const userVote = await getUserVote(buildId, userId)

  return {
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
    userVote,
  }
}

export async function handleVote(
  buildId: string,
  userId: string,
  newVoteType: VoteType,
  currentState: VoteState,
): Promise<VoteState> {
  const { userVote, upvotes, downvotes } = currentState

  let newUpvotes = upvotes
  let newDownvotes = downvotes

  // Remove previous vote if exists
  if (userVote === "upvote") {
    newUpvotes--
  } else if (userVote === "downvote") {
    newDownvotes--
  }

  // Add new vote if not removing
  if (newVoteType === "upvote" && userVote !== "upvote") {
    newUpvotes++
  } else if (newVoteType === "downvote" && userVote !== "downvote") {
    newDownvotes++
  }

  // If clicking the same vote type, remove the vote
  const finalVoteType = userVote === newVoteType ? null : newVoteType

  await setUserVote(buildId, userId, finalVoteType)

  return {
    upvotes: newUpvotes,
    downvotes: newDownvotes,
    userVote: finalVoteType,
  }
}
