import { z } from 'zod'

export const createInterviewSchema = z.object({
  role: z.string().min(2).max(100).trim(),
  description: z.string().min(10).max(2000).trim(),
  experience: z.number().int().min(0).max(40),
  difficulty: z.enum(['junior', 'mid', 'senior', 'staff']),
  techStack: z.array(z.string().max(50)).min(1).max(20),
})

export const transcriptEventSchema = z.object({
  attemptId: z.string().min(1).max(128),
  role: z.enum(['candidate', 'interviewer']),
  content: z.string().min(1).max(5000).trim(),
  questionIndex: z.number().int().min(0),
})

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>
export type TranscriptEventInput = z.infer<typeof transcriptEventSchema>
