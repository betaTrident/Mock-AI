import { cn } from "@/lib/utils"

type MetricBarProps = {
  label: string
  score: number
  status: "good" | "needs-work"
  compact?: boolean
}

export function MetricBar({ label, score, status, compact }: MetricBarProps) {
  const statusLabel = status === "good" ? "Good" : "Needs work"
  const barColor = status === "good" ? "bg-emerald-500" : "bg-amber-500"
  const textColor =
    status === "good" ? "text-emerald-400" : "text-amber-400"

  return (
    <div className={cn("flex flex-col gap-1.5", compact && "gap-1")}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="shrink-0 tabular-nums">
          <span className="font-medium text-foreground">{score}</span>
          <span className="mx-1 text-muted-foreground">—</span>
          <span className={cn("text-xs font-medium", textColor)}>
            {statusLabel}
          </span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${score}`}
        />
      </div>
    </div>
  )
}
