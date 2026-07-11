import Link from "next/link"

import { ScoreChip } from "@/components/shared/ScoreChip"
import { StatusBadge } from "@/components/shared/StatusBadge"
import type { DashboardInterview } from "@/lib/dashboard-types"

const difficultyTone = {
  junior: "success",
  mid: "warning",
  senior: "danger",
  staff: "danger",
} as const

const difficultyLabel = {
  junior: "Easy",
  mid: "Medium",
  senior: "Hard",
  staff: "Hard",
} as const

type RecentInterviewsTableProps = {
  interviews: DashboardInterview[]
}

export function RecentInterviewsTable({ interviews }: RecentInterviewsTableProps) {
  const rows = interviews.slice(0, 6)

  return (
    <div className="product-panel h-full">
      <div className="product-panel-header">
        <h2 className="text-sm font-semibold">Recent Mock Interviews</h2>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_0.6fr] px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Interview Name</span>
          <span>Difficulty</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">Score</span>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">No interviews yet.</p>
        ) : (
          rows.map((interview) => (
            <Link
              key={interview.id}
              href={`/interview/${interview.id}`}
              className="product-table-row grid grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_0.6fr]"
            >
              <span className="truncate text-sm font-medium">{interview.role}</span>
              <StatusBadge tone={difficultyTone[interview.difficulty]}>
                {difficultyLabel[interview.difficulty]}
              </StatusBadge>
              <StatusBadge tone={interview.progressPercent === 100 ? "success" : "info"}>
                {interview.progressPercent === 100 ? "Completed" : "In Progress"}
              </StatusBadge>
              <span className="text-sm text-muted-foreground">
                {interview.completedAt ?? "—"}
              </span>
              <span className="text-right">
                {interview.lastAttemptScore !== undefined ? (
                  <ScoreChip score={interview.lastAttemptScore} />
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
