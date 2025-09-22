"use client"

import { useState, useMemo, useEffect } from "react"
import { BuildGrid } from "@/components/build-grid"
import { BuildFilters } from "@/components/build-filters"
import { getAllBuilds, type FirebaseBuild } from "@/lib/firebase-db"

export function BuildFeed() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [builds, setBuilds] = useState<FirebaseBuild[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBuilds = async () => {
      try {
        const firebaseBuilds = await getAllBuilds()
        setBuilds(firebaseBuilds)
      } catch (error) {
        console.error("Failed to load builds:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBuilds()
  }, [])

  const filteredBuilds = useMemo(() => {
    let filtered = builds

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((build) => build.type === selectedType)
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((build) => selectedTags.some((tag) => build.tags.includes(tag)))
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [builds, selectedType, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading builds...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card rounded-lg border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground">Filters</h2>
                </div>
                <BuildFilters
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                />
              </div>
            </div>
          </div>

          {/* Main feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Build Feed</h1>
                <p className="text-muted-foreground mt-1">Discover what the community is building</p>
              </div>
              <div className="text-sm text-muted-foreground">{filteredBuilds.length} builds</div>
            </div>

            <BuildGrid builds={filteredBuilds} showAuthor={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
