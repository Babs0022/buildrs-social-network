import { Navigation } from "@/components/navigation"
import { BuildCard } from "@/components/build-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Zap, Users } from "lucide-react"
import Link from "next/link"

// Sample data - will be replaced with real data later
const featuredBuilds = [
  {
    id: "1",
    title: "DevUI Component Library",
    description:
      "Production-ready React components with TypeScript support. 50+ components, dark mode, full accessibility.",
    type: "launch" as const,
    tags: ["react", "typescript", "ui-library"],
    upvotes: 23,
    downvotes: 1,
    commentCount: 8,
    author: {
      username: "sarahbuilds",
      displayName: "Sarah Chen",
      avatar: "/developer-avatar.png",
    },
    links: {
      demo: "https://devui.example.com",
      github: "https://github.com/sarahchen/devui",
    },
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    title: "AI Commit Message Generator",
    description:
      "Testing GPT-4 for generating semantic commit messages from git diffs. Early prototype, 70% accuracy so far.",
    type: "experiment" as const,
    tags: ["ai", "git", "developer-tools"],
    upvotes: 12,
    downvotes: 0,
    commentCount: 5,
    author: {
      username: "alexdev",
      displayName: "Alex Developer",
      avatar: "/developer-avatar-2.png",
    },
    links: {
      github: "https://github.com/alexdev/ai-commit",
    },
    createdAt: "4 hours ago",
  },
  {
    id: "3",
    title: "Real-time Collaboration Tool",
    description:
      "Added WebSocket support and cursor tracking to our design tool. Now supports 50+ concurrent users with sub-100ms latency.",
    type: "update" as const,
    tags: ["websockets", "real-time", "collaboration"],
    upvotes: 34,
    downvotes: 2,
    commentCount: 12,
    author: {
      username: "designerdev",
      displayName: "Jordan Kim",
      avatar: "/diverse-designer-avatars.png",
    },
    links: {
      demo: "https://collab.example.com",
    },
    createdAt: "6 hours ago",
  },
]

const topBuilders = [
  { rank: 1, username: "sarahbuilds", score: 892, streak: 5 },
  { rank: 2, username: "alexdev", score: 756, streak: 3 },
  { rank: 3, username: "designerdev", score: 634, streak: 7 },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">You are what you build</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Showcase your projects. Build your reputation. Connect with creators who are building the future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">
                Join BUILDRS
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/feed">Explore Builds</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Code className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-muted-foreground">Projects Shared</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">2,500+</div>
              <div className="text-muted-foreground">Active Builders</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">50,000+</div>
              <div className="text-muted-foreground">Upvotes Given</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Builds */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Builds</h2>
            <Button variant="outline" asChild>
              <Link href="/feed">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBuilds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Builders */}
      <section className="px-6 py-16 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Top Builders</h2>
            <Button variant="outline" asChild>
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topBuilders.map((builder) => (
              <div
                key={builder.username}
                className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border"
              >
                <div className="text-2xl font-bold text-muted-foreground">#{builder.rank}</div>
                <div className="flex-1">
                  <div className="font-semibold">@{builder.username}</div>
                  <div className="text-sm text-muted-foreground">Score: {builder.score}</div>
                </div>
                <Badge variant="secondary">{builder.streak} day streak</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to showcase your builds?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who are building their reputation one project at a time.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Start Building Your Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">© 2024 BUILDRS. Built by creators, for creators.</div>
          <div className="flex gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
