import { getAllBuilds, type FirebaseProfile } from "@/lib/firebase-db"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface LeaderboardEntry extends FirebaseProfile {
  rank: number
  finalScore: number
}

export async function calculateLeaderboard(period: "week" | "month" | "all" = "all"): Promise<LeaderboardEntry[]> {
  try {
    const profilesSnapshot = await getDocs(collection(db, "profiles"))
    const profiles = profilesSnapshot.docs.map((doc) => doc.data() as FirebaseProfile)

    // Calculate final scores using the formula from the spec:
    // Final Score = (Builder Score × 0.6) + (Total Upvotes × 0.3) + (Streak Bonus × 0.1)
    const scoredProfiles = profiles.map((profile) => {
      const streakBonus = Math.min(profile.buildStreak * 10, 100) // Cap streak bonus at 100
      const finalScore = Math.round(profile.builderScore * 0.6 + profile.totalUpvotes * 0.3 + streakBonus * 0.1)

      return {
        ...profile,
        finalScore,
        rank: 0, // Will be set after sorting
      }
    })

    // Sort by final score (descending) and assign ranks
    const sortedProfiles = scoredProfiles
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((profile, index) => ({
        ...profile,
        rank: index + 1,
      }))

    return sortedProfiles
  } catch (error) {
    console.error("Failed to calculate leaderboard:", error)
    return []
  }
}

export async function getLeaderboardStats() {
  try {
    const [profilesSnapshot, builds] = await Promise.all([getDocs(collection(db, "profiles")), getAllBuilds()])

    const profiles = profilesSnapshot.docs.map((doc) => doc.data() as FirebaseProfile)

    const totalBuilders = profiles.length
    const totalBuilds = builds.length
    const totalUpvotes = builds.reduce((sum, build) => sum + build.upvotes, 0)
    const activeBuilders = profiles.filter((profile) => profile.buildStreak > 0).length

    return {
      totalBuilders,
      totalBuilds,
      totalUpvotes,
      activeBuilders,
    }
  } catch (error) {
    console.error("Failed to get leaderboard stats:", error)
    return {
      totalBuilders: 0,
      totalBuilds: 0,
      totalUpvotes: 0,
      activeBuilders: 0,
    }
  }
}
