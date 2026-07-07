export type AgentName =
  | 'planner'
  | 'question'
  | 'followup'
  | 'evaluator'
  | 'coach'
  | 'guard'

export interface AgentContext {
  attemptId: string
  userId: string
  input: Record<string, unknown>
}
