import { notFound } from "next/navigation"
import { ProfileHeader } from "@/components/profile-header"
import { BuildGrid } from "@/components/build-grid"
import { getProfileByUsername, getBuildsByUser } from "@/lib/firebase-db"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfileByUsername(params.username)

  if (!profile) {
    notFound()
  }

  const builds = await getBuildsByUser(profile.id)

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Builds</h2>
            <p className="text-muted-foreground">{builds.length} builds</p>
          </div>

          <BuildGrid builds={builds} />
        </div>
      </div>
    </div>
  )
}
