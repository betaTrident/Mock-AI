import Link from "next/link"

import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"

export default function SharedReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shared Reports"
        description="Links you've shared for read-only interview feedback review."
      />
      <EmptyState
        title="No shared reports yet"
        description="Share a feedback report from any completed interview to see it listed here."
        action={
          <Button asChild variant="outline">
            <Link href="/feedback">View feedback</Link>
          </Button>
        }
      />
    </div>
  )
}
