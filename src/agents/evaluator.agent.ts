import { runAgentWithRetry } from '@/lib/agent-runner'
import { createAgentRun, completeAgentRun, failAgentRun } from '@/lib/agent-persistence'
import { generateStructured } from '@/lib/gemini'
import {
  EvaluatorInputSchema,
  EvaluationResultSchema,
  type EvaluatorInput,
  type EvaluationResultOutput,
} from '@/lib/schemas/agents'

const EVALUATOR_SYSTEM_PROMPT = `You are an interview evaluator. Score answers using the rubric only.
Use transcript evidence — quote specific answers. Be fair and constructive.
Do not invent answers not present in the transcript. Return structured JSON only.`

function summarizeTranscript(input: EvaluatorInput) {
  return input.transcript
    .filter((event) => event.role === 'candidate')
    .map(
      (event) =>
        `Q${event.questionIndex + 1}: ${event.content.slice(0, 500)}`
    )
    .join('\n')
}

export async function runEvaluatorAgent(
  input: EvaluatorInput,
  context: { attemptId: string; userId: string }
): Promise<EvaluationResultOutput> {
  EvaluatorInputSchema.parse(input)
  const started = Date.now()
  const runId = await createAgentRun({
    attemptId: context.attemptId,
    userId: context.userId,
    agentName: 'evaluator',
    input: { attemptId: input.attemptId, questionCount: input.questions.length },
    modelUsed: 'gemini-2.5-flash',
  })

  try {
    const result = await runAgentWithRetry(async () => {
      const summary = summarizeTranscript(input)
      const userPrompt = `Evaluate this interview attempt ${input.attemptId}.
Questions:
${input.questions.map((q, i) => `${i + 1}. ${q.text}`).join('\n')}
Rubric:
${input.rubric.map((r) => `${r.skill}: ${r.description}`).join('\n')}
Candidate answer excerpts:
${summary}`

      const { output } = await generateStructured(
        EvaluationResultSchema,
        EVALUATOR_SYSTEM_PROMPT,
        userPrompt,
        { name: 'EvaluationResult', description: 'Rubric-based interview evaluation' }
      )
      return EvaluationResultSchema.parse({
        ...output,
        attemptId: input.attemptId,
      })
    }, { agentName: 'evaluator', attemptId: context.attemptId, input: { attemptId: input.attemptId, questionCount: input.questions.length } })

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

export function getEvaluatorSystemPromptLength(): number {
  return EVALUATOR_SYSTEM_PROMPT.length
}
