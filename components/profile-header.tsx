"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Twitter, ExternalLink, Copy, Check } from "lucide-react"
import type { FirebaseProfile } from "@/lib/firebase-db"
import { useState } from "react"

interface ProfileHeaderProps {
  profile: FirebaseProfile
  isOwnProfile?: boolean
}

export function ProfileHeader({ profile, isOwnProfile = false }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false)

  const copyWalletAddress = async () => {
    await navigator.clipboard.writeText(profile.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.displayName} />
            <AvatarFallback className="text-2xl">
              {profile.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">{profile.displayName}</h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Score: {profile.builderScore}
                </Badge>
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">{formatWalletAddress(profile.walletAddress)}</code>
                <Button variant="ghost" size="sm" onClick={copyWalletAddress} className="h-6 w-6 p-0">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              {profile.bio && <p className="text-foreground max-w-2xl">{profile.bio}</p>}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{profile.totalUpvotes} upvotes</span>
              <span>{profile.buildStreak} day streak</span>
              <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.github && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://github.com/${profile.socialLinks.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              {profile.socialLinks.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://twitter.com/${profile.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </a>
                </Button>
              )}
              {profile.socialLinks.farcaster && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://warpcast.com/${profile.socialLinks.farcaster}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Farcaster
                  </a>
                </Button>
              )}
            </div>

            <div className="flex gap-3">{isOwnProfile ? <Button>Edit Profile</Button> : <Button>Follow</Button>}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
