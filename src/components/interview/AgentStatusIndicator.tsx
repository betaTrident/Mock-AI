"use client"

import { motion } from "framer-motion"

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
      <div className={cn("flex items-center gap-2", className)} aria-live="polite">
        <Skeleton className="h-6 w-24" />
        <span className="text-xs text-muted-foreground">Agent running...</span>
      </div>
    )
  }

  if (!activeAgent) {
    return (
      <Badge variant="outline" className={className} aria-live="polite">
        Idle
      </Badge>
    )
  }

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="status"
      aria-live="polite"
      aria-label={`Active agent: ${agentLabels[activeAgent]}`}
    >
      <motion.span
        className="inline-block size-2 rounded-full bg-primary"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <span className="text-xs text-muted-foreground">Active agent</span>
      <Badge variant="default">{agentLabels[activeAgent]}</Badge>
    </div>
  )
}
