"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BuildFiltersProps {
  selectedType: string
  onTypeChange: (type: string) => void
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

const BUILD_TYPES = [
  { value: "all", label: "All" },
  { value: "launch", label: "Launches" },
  { value: "update", label: "Updates" },
  { value: "experiment", label: "Experiments" },
]

const POPULAR_TAGS = [
  "react",
  "typescript",
  "ai",
  "developer-tools",
  "ui-library",
  "github",
  "api",
  "serverless",
  "design-system",
  "accessibility",
]

export function BuildFilters({ selectedType, onTypeChange, selectedTags, onTagToggle }: BuildFiltersProps) {
  return (
    <div className="space-y-6 p-6 border-b border-border">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Type</h3>
        <div className="flex flex-wrap gap-2">
          {BUILD_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {(selectedType !== "all" || selectedTags.length > 0) && (
        <div className="pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onTypeChange("all")
              selectedTags.forEach((tag) => onTagToggle(tag))
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
