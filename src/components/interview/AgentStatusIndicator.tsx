import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type AgentName = "planner" | "question" | "followup" | "evaluator" | "coach" | "guard"

const agentLabels: Record<AgentName, string> = {
  planner: "Planner",
  question: "Question",
  followup: "Follow-up",
  evaluator: "Evaluator",
  coach: "Coach",
  guard: "Safety",
}

type AgentStatusIndicatorProps = {
  activeAgent?: AgentName
  isLoading?: boolean
  className?: string
}

export function AgentStatusIndicator({
  activeAgent,
  isLoading = false,
  className,
}: AgentStatusIndicatorProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Skeleton className="h-6 w-24" />
        <span className="text-xs text-muted-foreground">Agent running...</span>
      </div>
    )
  }

  if (!activeAgent) {
    return (
      <Badge variant="outline" className={className}>
        Idle
      </Badge>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground">Active agent</span>
      <Badge variant="default">{agentLabels[activeAgent]}</Badge>
    </div>
  )
}
