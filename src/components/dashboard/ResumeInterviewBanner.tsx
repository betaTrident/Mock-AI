import Link from "next/link"
import { FileTextIcon, PlayCircleIcon } from "lucide-react"

import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { InProgressAttempt } from "@/lib/dashboard-types"

type ResumeInterviewBannerProps = {
  attempt: InProgressAttempt
}

export function ResumeInterviewBanner({ attempt }: ResumeInterviewBannerProps) {
  return (
    <div className="product-panel">
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="info">In Progress</StatusBadge>
            <span className="text-xs text-muted-foreground">Technical interview</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{attempt.role}</h2>
            <p className="text-sm text-muted-foreground">Started {attempt.startedLabel}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {attempt.questionIndex}/{attempt.totalQuestions} questions · {attempt.elapsedMinutes}m
              </span>
            </div>
            <Progress value={attempt.progressPercent} aria-label={`${attempt.progressPercent}% complete`} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/interview/${attempt.id}`}>
              <PlayCircleIcon data-icon="inline-start" />
              Continue Interview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/interview/${attempt.id}`}>
              <FileTextIcon data-icon="inline-start" />
              Review Notes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
