"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MicIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { InterviewCard } from "@/components/interview/InterviewCard"
import { InterviewSetupWizard } from "@/components/interview/InterviewSetupWizard"
import { AppShell } from "@/components/shared/AppShell"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  PLACEHOLDER_INTERVIEWS,
  PLACEHOLDER_STATS,
  PLACEHOLDER_USER,
} from "@/lib/placeholder-data"
import type { InterviewSetupData } from "@/components/interview/InterviewSetupWizard"

export default function DashboardPage() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const interviews = PLACEHOLDER_INTERVIEWS

  const handleCreateInterview = async (data: InterviewSetupData) => {
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
      setDialogOpen(false)
      router.push(result.id ? `/interview/${result.id}` : "/interview/new")
    } catch {
      toast.error("Could not create interview — using demo flow")
      setDialogOpen(false)
      router.push("/interview/int-001")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell user={PLACEHOLDER_USER}>
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="Dashboard"
          description="Track your interview practice sessions and progress."
          actions={
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon data-icon="inline-start" />
                  New Interview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>New Interview</DialogTitle>
                  <DialogDescription>
                    Configure your role, level, and tech stack before starting.
                  </DialogDescription>
                </DialogHeader>
                <InterviewSetupWizard
                  onSubmit={handleCreateInterview}
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          }
        />

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{PLACEHOLDER_STATS.totalAttempts} attempts</Badge>
          <Badge variant="secondary">Avg score {PLACEHOLDER_STATS.avgScore}%</Badge>
          <Badge variant="secondary">{PLACEHOLDER_STATS.streak}-day streak</Badge>
        </div>

        {interviews.length === 0 ? (
          <EmptyState
            title="No interviews yet"
            description="Create your first mock interview to start practicing with AI coaching."
            actionLabel="New Interview"
            onAction={() => setDialogOpen(true)}
            icon={<MicIcon className="size-10" />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
