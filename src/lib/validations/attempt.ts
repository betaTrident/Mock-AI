import { z } from 'zod'

export const createAttemptSchema = z.object({
  interviewId: z.string().min(1),
})

export const agentStepSchema = z.object({
  candidateMessage: z.string().max(5000).optional(),
})

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>
export type AgentStepInput = z.infer<typeof agentStepSchema>
