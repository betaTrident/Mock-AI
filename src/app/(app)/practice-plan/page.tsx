import Link from "next/link"

import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"

export default function PracticePlanPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Practice Plan"
        description="Personalized coaching goals generated after each completed interview."
      />
      <EmptyState
        title="Your practice plan will appear here"
        description="Finish an interview and review feedback to unlock a tailored weekly practice plan."
        action={
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        }
      />
    </div>
  )
}
