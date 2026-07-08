"use client"

import { use } from "react"
import { FileDownIcon } from "lucide-react"

import { FeedbackReport } from "@/components/interview/FeedbackReport"
import { AppShell } from "@/components/shared/AppShell"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { PLACEHOLDER_FEEDBACK, PLACEHOLDER_USER } from "@/lib/placeholder-data"

type FeedbackPageProps = {
  params: Promise<{ id: string }>
}

export default function FeedbackPage({ params }: FeedbackPageProps) {
  const { id } = use(params)
  return (
    <AppShell user={PLACEHOLDER_USER}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <PageHeader
          title="Interview Feedback"
          description="Structured evaluation and practice plan from your coaching session."
          badge="Complete"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Interview", href: `/interview/${id}` },
            { label: "Feedback" },
          ]}
          actions={
            <Button variant="outline" disabled title="Export PDF — available in Phase 5">
              <FileDownIcon data-icon="inline-start" />
              Export PDF
            </Button>
          }
        />

        <FeedbackReport report={PLACEHOLDER_FEEDBACK} />
      </div>
    </AppShell>
  )
}
