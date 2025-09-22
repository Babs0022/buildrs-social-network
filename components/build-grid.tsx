import { type FirebaseBuild, getProfile } from "@/lib/firebase-db"
import { BuildCard } from "@/components/build-card"

interface BuildGridProps {
  builds: FirebaseBuild[]
  showAuthor?: boolean
}

export async function BuildGrid({ builds, showAuthor = false }: BuildGridProps) {
  if (builds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No builds yet.</p>
      </div>
    )
  }

  const buildsWithAuthors = await Promise.all(
    builds.map(async (build) => {
      const author = showAuthor ? await getProfile(build.userId) : undefined
      return { build, author }
    }),
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {buildsWithAuthors.map(({ build, author }) => (
        <BuildCard key={build.id} build={build} author={author} />
      ))}
    </div>
  )
}
