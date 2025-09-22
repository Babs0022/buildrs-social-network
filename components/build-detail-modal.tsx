"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, ExternalLink, Github, Send } from "lucide-react"
import { VoteButtons } from "@/components/vote-buttons"
import type { FirebaseBuild, FirebaseProfile } from "@/lib/firebase-db"

interface BuildDetailModalProps {
  build: FirebaseBuild
  author: FirebaseProfile
  isOpen: boolean
  onClose: () => void
}

export function BuildDetailModal({ build, author, isOpen, onClose }: BuildDetailModalProps) {
  const [comment, setComment] = useState("")

  const typeColors = {
    launch: "bg-green-500/10 text-green-400 border-green-500/20",
    update: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    experiment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      // In real app, submit comment to API
      console.log("Submitting comment:", comment)
      setComment("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{author.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{author.displayName}</p>
              <p className="text-sm text-muted-foreground">@{author.username}</p>
            </div>
            <Badge className={typeColors[build.type]} variant="outline">
              {build.type}
            </Badge>
          </div>
          <DialogTitle className="text-2xl text-balance">{build.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground text-pretty">{build.description}</p>

          <div className="flex flex-wrap gap-2">
            {build.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {build.links && (
            <div className="flex gap-3">
              {build.links.demo && (
                <Button variant="outline" asChild>
                  <a href={build.links.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Demo
                  </a>
                </Button>
              )}
              {build.links.github && (
                <Button variant="outline" asChild>
                  <a href={build.links.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
              {build.links.website && (
                <Button variant="outline" asChild>
                  <a href={build.links.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          )}

          <div className="flex items-center gap-6 py-4 border-y border-border">
            <VoteButtons buildId={build.id} initialUpvotes={build.upvotes} initialDownvotes={build.downvotes} />
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{build.commentCount} comments</span>
            </div>
            <span className="text-sm text-muted-foreground ml-auto">
              {new Date(build.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Comments</h3>

            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button size="sm" onClick={handleSubmitComment} disabled={!comment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/developer-avatar.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">John Developer</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This looks amazing! The TypeScript support is exactly what I've been looking for. Great work on the
                    accessibility features too.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
