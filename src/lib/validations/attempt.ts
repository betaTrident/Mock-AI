import { z } from 'zod'

export const createAttemptSchema = z.object({
  interviewId: z.string().min(1),
})

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>
