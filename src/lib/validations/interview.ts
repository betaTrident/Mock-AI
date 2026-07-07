import { z } from 'zod'

export const createInterviewSchema = z.object({
  role: z.string().min(1),
  description: z.string(),
  experience: z.number().int().min(0),
  difficulty: z.enum(['junior', 'mid', 'senior', 'staff']),
  techStack: z.array(z.string()),
})

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>
