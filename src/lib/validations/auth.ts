import { z } from 'zod'

export const sessionTokenSchema = z.object({
  idToken: z.string().min(1),
})

export type SessionTokenInput = z.infer<typeof sessionTokenSchema>
