import Link from "next/link"

import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"

export default function FeedbackListPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Feedback"
        description="Review scores, coaching notes, and practice plans from completed sessions."
      />
      <EmptyState
        title="No feedback reports yet"
        description="Complete a mock interview to generate your first structured feedback report."
        action={
          <Button asChild>
            <Link href="/interview/new">Start practicing</Link>
          </Button>
        }
      />
    </div>
  )
}
