// SERVER-ONLY — never import in 'use client' components
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText, Output } from 'ai'
import type { z } from 'zod'

export const GEMINI_MODEL = 'gemini-2.5-flash'

function getGoogleProvider() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }
  return createGoogleGenerativeAI({ apiKey })
}

export function getGeminiModel() {
  return getGoogleProvider()(GEMINI_MODEL)
}

export interface StructuredGenerationResult<T> {
  output: T
  tokenCount: number | null
  modelUsed: string
}

export async function generateStructured<T extends z.ZodType>(
  schema: T,
  systemPrompt: string,
  userPrompt: string,
  options?: { name?: string; description?: string }
): Promise<StructuredGenerationResult<z.infer<T>>> {
  const result = await generateText({
    model: getGeminiModel(),
    system: systemPrompt,
    prompt: userPrompt,
    output: Output.object({
      schema,
      name: options?.name,
      description: options?.description,
    }),
    providerOptions: {
      google: { structuredOutputs: true },
    },
  })

  if (result.output == null) {
    throw new Error('Structured generation returned no output')
  }

  return {
    output: result.output as z.infer<T>,
    tokenCount: result.usage?.totalTokens ?? null,
    modelUsed: GEMINI_MODEL,
  }
}
