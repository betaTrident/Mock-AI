import { runAgentWithRetry } from '@/lib/agent-runner'
import { createAgentRun, completeAgentRun, failAgentRun } from '@/lib/agent-persistence'
import { generateStructured } from '@/lib/gemini'
import {
  CoachInputSchema,
  PracticePlanSchema,
  type CoachInput,
  type PracticePlanOutput,
} from '@/lib/schemas/agents'

const COACH_SYSTEM_PROMPT = `You are an interview coach. Create a personalized practice plan.
Give specific, role-targeted recommendations. Never give generic study advice.
Focus on weak areas with actionable weekly goals and curated resources.
Return structured JSON only.`

export async function runCoachAgent(
  input: CoachInput,
  context: { attemptId: string; userId: string }
): Promise<PracticePlanOutput> {
  CoachInputSchema.parse(input)
  const started = Date.now()
  const runId = await createAgentRun({
    attemptId: context.attemptId,
    userId: context.userId,
    agentName: 'coach',
    input: { role: input.role, weakAreas: input.weakAreas },
    modelUsed: 'gemini-2.5-flash',
  })

  try {
    const result = await runAgentWithRetry(async () => {
      const userPrompt = `Role: ${input.role}
Weak areas: ${input.weakAreas.join(', ') || 'general interview skills'}
Score: ${input.evaluation.percentageScore}%
Strengths: ${input.evaluation.strengths.join(', ')}
Improvement areas: ${input.evaluation.areasForImprovement.join(', ')}
Create a 4-week practice plan with specific tasks and resources.`

      const { output } = await generateStructured(
        PracticePlanSchema,
        COACH_SYSTEM_PROMPT,
        userPrompt,
        { name: 'PracticePlan', description: 'Personalized interview practice plan' }
      )
      return PracticePlanSchema.parse(output)
    }, { agentName: 'coach', attemptId: context.attemptId })

    await completeAgentRun(runId, {
      output: result,
      durationMs: Date.now() - started,
      tokenCount: null,
    })
    return result
  } catch (error) {
    await failAgentRun(runId, String(error), Date.now() - started)
    throw error
  }
}

export function getCoachSystemPromptLength(): number {
  return COACH_SYSTEM_PROMPT.length
}
