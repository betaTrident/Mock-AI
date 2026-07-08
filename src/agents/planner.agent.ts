import { runAgentWithRetry } from '@/lib/agent-runner'
import { createAgentRun, completeAgentRun, failAgentRun } from '@/lib/agent-persistence'
import { generateStructured } from '@/lib/gemini'
import {
  PlannerInputSchema,
  PlannerOutputSchema,
  type PlannerInput,
  type PlannerOutput,
} from '@/lib/schemas/agents'

const PLANNER_SYSTEM_PROMPT = `You are an interview planning agent. Design a fair, role-specific interview strategy and rubric.
Cover technical depth, communication, and problem-solving. Calibrate difficulty to the candidate level.
Return structured JSON only. Keep strategy concise and actionable.`

export async function runPlannerAgent(
  input: PlannerInput,
  context: { attemptId: string; userId: string }
): Promise<PlannerOutput> {
  PlannerInputSchema.parse(input)
  const started = Date.now()
  const runId = await createAgentRun({
    attemptId: context.attemptId,
    userId: context.userId,
    agentName: 'planner',
    input,
    modelUsed: 'gemini-2.5-flash',
  })

  try {
    const result = await runAgentWithRetry(async () => {
      const userPrompt = `Plan an interview for:
Role: ${input.role}
Description: ${input.description}
Experience: ${input.experience} years
Difficulty: ${input.difficulty}
Tech stack: ${input.techStack.join(', ') || 'not specified'}
Generate 5 questions worth of planning with balanced topics.`

      const { output } = await generateStructured(
        PlannerOutputSchema,
        PLANNER_SYSTEM_PROMPT,
        userPrompt,
        { name: 'PlannerOutput', description: 'Interview plan with strategy, topics, rubric' }
      )
      return PlannerOutputSchema.parse({ ...output, role: input.role })
    })

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

export function getPlannerSystemPromptLength(): number {
  return PLANNER_SYSTEM_PROMPT.length
}
