"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { InterviewSetupWizard } from "@/components/interview/InterviewSetupWizard"
import { AppShell } from "@/components/shared/AppShell"
import { PageHeader } from "@/components/shared/PageHeader"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PLACEHOLDER_USER } from "@/lib/placeholder-data"
import type { InterviewSetupData } from "@/components/interview/InterviewSetupWizard"

export default function NewInterviewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: InterviewSetupData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create interview")
      const result = (await response.json()) as { id?: string }
      toast.success("Interview created")
      router.push(result.id ? `/interview/${result.id}` : "/interview/int-001")
    } catch {
      toast.error("API unavailable — opening demo interview")
      router.push("/interview/int-001")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell user={PLACEHOLDER_USER}>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
        <PageHeader
          title="New Interview"
          description="Set up your mock interview in four quick steps."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "New Interview" },
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Interview setup</CardTitle>
            <CardDescription>
              All steps are validated before you can start the session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InterviewSetupWizard onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
