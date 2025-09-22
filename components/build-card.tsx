import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, ExternalLink, Github } from "lucide-react"
import { VoteButtons } from "@/components/vote-buttons"
import type { FirebaseBuild, FirebaseProfile } from "@/lib/firebase-db"

interface BuildCardProps {
  build: FirebaseBuild
  author?: FirebaseProfile | null
}

export function BuildCard({ build, author }: BuildCardProps) {
  const typeColors = {
    launch: "bg-green-500/10 text-green-400 border-green-500/20",
    update: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    experiment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }

  const buildAuthor = author || {
    username: "unknown",
    displayName: "Unknown User",
    avatar: "/placeholder.svg",
  }

  return (
    <Card className="bg-card border-border hover:border-border/60 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {author && (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={buildAuthor.avatar || "/placeholder.svg"} />
                <AvatarFallback>{buildAuthor.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{buildAuthor.displayName}</p>
                <p className="text-xs text-muted-foreground">@{buildAuthor.username}</p>
              </div>
            </div>
          )}
          <Badge className={typeColors[build.type]} variant="outline">
            {build.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <h3 className="font-semibold text-lg mb-2 text-balance">{build.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 text-pretty">{build.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {build.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {build.links && (
          <div className="flex gap-2">
            {build.links.demo && (
              <Button size="sm" variant="outline" asChild>
                <a href={build.links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Demo
                </a>
              </Button>
            )}
            {build.links.github && (
              <Button size="sm" variant="outline" asChild>
                <a href={build.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3 mr-1" />
                  Code
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <VoteButtons buildId={build.id} initialUpvotes={build.upvotes} initialDownvotes={build.downvotes} />
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{build.commentCount}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{new Date(build.createdAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
