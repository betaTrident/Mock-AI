import { z } from 'zod'

export const createAttemptSchema = z.object({
  interviewId: z.string().min(1).max(128),
})

export const agentStepSchema = z.object({
  candidateMessage: z.string().min(1).max(5000).trim().optional(),
})

export const syncTranscriptSchema = z.object({
  events: z
    .array(
      z.object({
        id: z.string().min(1).max(128),
        role: z.enum(['candidate', 'interviewer']),
        content: z.string().min(1).max(5000).trim(),
        questionIndex: z.number().int().min(0),
        agentName: z.string().max(50).optional(),
      })
    )
    .min(1)
    .max(100),
})

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>
export type AgentStepInput = z.infer<typeof agentStepSchema>
export type SyncTranscriptInput = z.infer<typeof syncTranscriptSchema>
