import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function CreateBuildPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Share Your Build</h1>
            <p className="text-muted-foreground mt-2">Tell the community about what you've been working on</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Build Details</CardTitle>
              <CardDescription>Share your project with the BUILDRS community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Build Type</Label>
                <Select>
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
                <Input id="title" placeholder="Give your build a catchy title" maxLength={100} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you built, the problem it solves, and any interesting technical details"
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    react
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    typescript
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                </div>
                <Input placeholder="Add tags (press Enter)" />
                <p className="text-xs text-muted-foreground">Add up to 5 tags to help others discover your build</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="demo">Demo URL (optional)</Label>
                  <Input id="demo" type="url" placeholder="https://your-demo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL (optional)</Label>
                  <Input id="github" type="url" placeholder="https://github.com/username/repo" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL (optional)</Label>
                <Input id="website" type="url" placeholder="https://your-website.com" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Share Build</Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
