"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, ArrowLeft } from "lucide-react"
import { createBuild, updateProfile } from "@/lib/firebase-db"
import type { FirebaseBuild } from "@/lib/firebase-db"

export default function CreateBuildPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"

  const [formData, setFormData] = useState({
    type: "" as "launch" | "update" | "experiment" | "",
    title: "",
    description: "",
    tags: [] as string[],
    currentTag: "",
    demo: "",
    github: "",
    website: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/connect")
    }
  }, [user, router])

  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim()) && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: "",
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async () => {
    if (!user || !profile || !formData.type || !formData.title.trim() || !formData.description.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      const buildData: Omit<FirebaseBuild, "id" | "createdAt" | "updatedAt"> = {
        userId: profile.id,
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags,
        links: {
          demo: formData.demo.trim() || undefined,
          github: formData.github.trim() || undefined,
          website: formData.website.trim() || undefined,
        },
        media: [],
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
      }

      await createBuild(buildData)

      // If this is during onboarding, mark onboarding as completed and redirect
      if (isOnboarding) {
        await updateProfile(profile.id, { onboardingCompleted: true })
        router.push("/feed?welcome=true")
      } else {
        router.push("/feed")
      }
    } catch (error) {
      console.error("Failed to create build:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (isOnboarding) {
      router.push("/onboarding")
    } else {
      router.push("/feed")
    }
  }

  if (!user || !profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {isOnboarding && <Badge variant="secondary">Onboarding</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {isOnboarding ? "Share Your First Build" : "Share Your Build"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isOnboarding
                ? "Let's showcase what you've been working on to the community"
                : "Tell the community about what you've been working on"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Build Details</CardTitle>
              <CardDescription>Share your project with the BUILDRS community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Build Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "launch" | "update" | "experiment") =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select build type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="launch">Launch - New project release</SelectItem>
                    <SelectItem value="update">Update - Project improvement</SelectItem>
                    <SelectItem value="experiment">Experiment - Early prototype</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your build a catchy title"
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you built, the problem it solves, and any interesting technical details"
                  maxLength={500}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags (press Enter)"
                    value={formData.currentTag}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentTag: e.target.value }))}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    disabled={formData.tags.length >= 5}
                  />
                  <Button
                    onClick={addTag}
                    variant="outline"
                    disabled={formData.tags.length >= 5 || !formData.currentTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Add up to 5 tags to help others discover your build</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="demo">Demo URL (optional)</Label>
                  <Input
                    id="demo"
                    type="url"
                    placeholder="https://your-demo.com"
                    value={formData.demo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, demo: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL (optional)</Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={formData.github}
                    onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL (optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-website.com"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.type || !formData.title.trim() || !formData.description.trim()}
                >
                  {isSubmitting ? "Sharing..." : "Share Build"}
                </Button>
                <Button variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
