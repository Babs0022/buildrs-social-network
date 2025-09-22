import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function CreateBuildButton() {
  return (
    <Button asChild className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg">
      <Link href="/create">
        <Plus className="w-6 h-6" />
        <span className="sr-only">Create new build</span>
      </Link>
    </Button>
  )
}
