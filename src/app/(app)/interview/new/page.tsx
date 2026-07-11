"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { InterviewSetupWizard, type InterviewSetupData } from "@/components/interview/InterviewSetupWizard"
import { PageHeader } from "@/components/shared/PageHeader"

export default function NewInterviewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: InterviewSetupData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create a new interview"
        description="Set up your interview preferences and let AI craft a tailored experience."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Interviews", href: "/interviews" },
          { label: "New Interview" },
        ]}
      />

      <InterviewSetupWizard onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
