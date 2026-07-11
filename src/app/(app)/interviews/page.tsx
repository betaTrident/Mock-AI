import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"

export default function InterviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Interviews"
        description="Browse and manage your mock interview sessions."
        actions={
          <Button asChild>
            <Link href="/interview/new">
              <PlusIcon data-icon="inline-start" />
              New Interview
            </Link>
          </Button>
        }
      />
      <EmptyState
        title="Your interviews live on the dashboard"
        description="Start a new session or return to the dashboard to resume in-progress practice."
        action={
          <Button asChild>
            <Link href="/interview/new">Create interview</Link>
          </Button>
        }
      />
    </div>
  )
}
