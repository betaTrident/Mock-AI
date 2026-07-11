"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DashboardKpiStrip } from "@/components/dashboard/DashboardKpiStrip"
import { DashboardOnboardingCta } from "@/components/dashboard/DashboardOnboardingCta"
import { DashboardWelcomeHeader } from "@/components/dashboard/DashboardWelcomeHeader"
import { RecentInterviewsTable } from "@/components/dashboard/RecentInterviewsTable"
import { ResumeInterviewBanner } from "@/components/dashboard/ResumeInterviewBanner"
import { SkillImprovementPanel } from "@/components/dashboard/SkillImprovementPanel"
import { WeeklyActivityChart } from "@/components/dashboard/WeeklyActivityChart"
import { InterviewSetupWizard } from "@/components/interview/InterviewSetupWizard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { DashboardData } from "@/lib/dashboard-types"
import type { InterviewSetupData } from "@/components/interview/InterviewSetupWizard"

type DashboardClientProps = {
  data: DashboardData
  userName: string
}

export function DashboardClient({ data, userName }: DashboardClientProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateInterview = async (formData: InterviewSetupData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to create interview")
      const result = (await response.json()) as { id?: string }
      toast.success("Interview created")
      setDialogOpen(false)
      router.push(result.id ? `/interview/${result.id}` : "/interview/new")
    } catch {
      toast.error("Could not create interview")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openCreateDialog = () => setDialogOpen(true)

  return (
    <div className="flex flex-col gap-6">
      <DashboardWelcomeHeader userName={userName} onStartInterview={openCreateDialog} />

      <DashboardKpiStrip metrics={data.metrics} insights={data.insights} />

      <div className="grid gap-4 xl:grid-cols-2">
        {data.inProgressAttempt ? (
          <ResumeInterviewBanner attempt={data.inProgressAttempt} />
        ) : (
          <div className="product-panel flex flex-col justify-center p-6">
            <h2 className="text-sm font-semibold">No session in progress</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a new interview to build momentum this week.
            </p>
          </div>
        )}
        <WeeklyActivityChart activity={data.insights.weeklyActivity} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RecentInterviewsTable interviews={data.interviews} />
        <SkillImprovementPanel
          skills={data.insights.skills}
          focusSkill={data.insights.focusSkill}
        />
      </div>

      <DashboardOnboardingCta onStartInterview={openCreateDialog} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Interview</DialogTitle>
            <DialogDescription>
              Configure your role, level, and tech stack before starting.
            </DialogDescription>
          </DialogHeader>
          <InterviewSetupWizard onSubmit={handleCreateInterview} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
