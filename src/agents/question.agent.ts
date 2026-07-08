import { runAgentWithRetry } from '@/lib/agent-runner'
import { createAgentRun, completeAgentRun, failAgentRun } from '@/lib/agent-persistence'
import { generateStructured } from '@/lib/gemini'
import {
  QuestionAgentInputSchema,
  QuestionListSchema,
  QuestionSchema,
  type QuestionAgentInput,
} from '@/lib/schemas/agents'
import type { Question } from '@/types/interview'
import type { HrQuestion } from '@/types/dataset'
import type { PlannerOutput } from '@/lib/schemas/agents'

const QUESTION_SYSTEM_PROMPT = `You are an interview question generator. Create diverse, role-appropriate questions.
Mix technical, behavioral, and situational types. Calibrate difficulty to the target level.
Each question must be distinct. Use few-shot examples only as style reference — never copy them.
Return structured JSON only.`

export function buildQuestionAgentPrompt(
  plannerOutput: PlannerOutput,
  fewShot: HrQuestion[]
): string {
  const examplesBlock =
    fewShot.length > 0
      ? `\n\nHere are real-world examples of strong ${plannerOutput.role} interview questions at this difficulty level:\n` +
        fewShot
          .map(
            (ex, i) =>
              `${i + 1}. "${ex.question}" (category: ${ex.category}, key terms: ${ex.keywords.slice(0, 3).join(', ')})`
          )
          .join('\n') +
        '\n\nUse these as stylistic reference. Generate NEW, DISTINCT questions — do not copy or paraphrase them directly.'
      : ''

  return `Generate ${plannerOutput.questionCount} interview questions for a ${plannerOutput.role} role.
Strategy: ${plannerOutput.strategy}
Topics to cover: ${plannerOutput.topics.join(', ')}
${examplesBlock}
Output a JSON object with a "questions" array matching the provided schema.`
}

export async function runQuestionAgent(
  input: QuestionAgentInput,
  context: { attemptId: string; userId: string }
): Promise<Question[]> {
  QuestionAgentInputSchema.parse(input)
  const started = Date.now()
  const runId = await createAgentRun({
    attemptId: context.attemptId,
    userId: context.userId,
    agentName: 'question',
    input: {
      ...input,
      fewShotExamples: input.fewShotExamples.map((ex) => ({
        question: ex.question,
        category: ex.category,
      })),
    },
    modelUsed: 'gemini-2.5-flash',
  })

  try {
    const result = await runAgentWithRetry(async () => {
      const userPrompt = buildQuestionAgentPrompt(input, input.fewShotExamples)
      const { output } = await generateStructured(
        QuestionListSchema,
        QUESTION_SYSTEM_PROMPT,
        userPrompt,
        { name: 'QuestionList', description: 'Generated interview questions' }
      )

      const questions = output.questions.map((q, index) =>
        QuestionSchema.parse({
          ...q,
          id: q.id || `${context.attemptId}-q${index}`,
          interviewId: input.interviewId,
          index,
          rubricVersion: q.rubricVersion || 'v1',
        })
      )
      return questions
    })

    await completeAgentRun(runId, {
      output: { questions: result },
      durationMs: Date.now() - started,
      tokenCount: null,
    })
    return result
  } catch (error) {
    await failAgentRun(runId, String(error), Date.now() - started)
    throw error
  }
}

export function getQuestionSystemPromptLength(): number {
  return QUESTION_SYSTEM_PROMPT.length
}
