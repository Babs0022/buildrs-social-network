"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { updateProfile } from "@/lib/firebase-db"
import { ArrowRight, User, Wrench, Compass, Trophy } from "lucide-react"

const ONBOARDING_STEPS = [
  { id: "profile", title: "Set Up Profile", icon: User },
  { id: "first-build", title: "Share Your First Build", icon: Wrench },
  { id: "tour", title: "Explore BUILDRS", icon: Compass },
  { id: "complete", title: "You're Ready!", icon: Trophy },
]

export default function OnboardingPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    skills: [] as string[],
    currentSkill: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/connect")
    }
  }, [user, router])

  const handleProfileSubmit = async () => {
    if (!profile?.id) return

    try {
      await updateProfile(profile.id, {
        displayName: formData.displayName || profile.displayName,
        bio: formData.bio,
        skills: formData.skills,
        onboardingCompleted: false, // Will be set to true after full onboarding
      })
      setCurrentStep(1)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const addSkill = () => {
    if (formData.currentSkill.trim() && !formData.skills.includes(formData.currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.currentSkill.trim()],
        currentSkill: "",
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const completeOnboarding = async () => {
    if (!profile?.id) return

    try {
      await updateProfile(profile.id, {
        onboardingCompleted: true,
      })
      router.push("/feed")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    }
  }

  if (!user || !profile) {
    return <div>Loading...</div>
  }

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Welcome to BUILDRS!</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex items-center gap-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 ${
                    index <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Set Up Your Builder Profile</CardTitle>
              <CardDescription>Tell the community about yourself and your building skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your name or builder alias"
                  value={formData.displayName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your building journey, interests, and what you're working on..."
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Skills & Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g., React, Solidity, 3D Printing)"
                    value={formData.currentSkill}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentSkill: e.target.value }))}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleProfileSubmit} className="w-full">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Share Your First Build</CardTitle>
              <CardDescription>Show the community what you've been working on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to share your work?</h3>
                <p className="text-muted-foreground mb-6">
                  BUILDRS is all about showcasing your projects, getting feedback, and inspiring others. Let's create
                  your first build post!
                </p>
                <Button onClick={() => router.push("/create?onboarding=true")} size="lg">
                  Create Your First Build <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Explore BUILDRS</CardTitle>
              <CardDescription>Discover all the features that make BUILDRS special</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Compass className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Feed</h4>
                    <p className="text-sm text-muted-foreground">
                      Discover amazing builds from the community, upvote your favorites, and get inspired
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Leaderboard</h4>
                    <p className="text-sm text-muted-foreground">
                      See top builders, track your builder score, and compete with the community
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Profiles</h4>
                    <p className="text-sm text-muted-foreground">
                      Follow other builders, showcase your work, and build your reputation
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setCurrentStep(3)} className="w-full">
                Got it! <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>You're All Set!</CardTitle>
              <CardDescription>Welcome to the BUILDRS community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Welcome to BUILDRS!</h3>
                <p className="text-muted-foreground mb-6">
                  You're now part of a community of builders, makers, and creators. Start exploring, sharing your work,
                  and connecting with other builders!
                </p>
                <Button onClick={completeOnboarding} size="lg">
                  Enter BUILDRS <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
