import { runAgentWithRetry } from '@/lib/agent-runner'
import { createAgentRun, completeAgentRun, failAgentRun } from '@/lib/agent-persistence'
import { generateStructured } from '@/lib/gemini'
import {
  FollowUpDecisionSchema,
  FollowUpInputSchema,
  type FollowUpDecision,
  type FollowUpInput,
} from '@/lib/schemas/agents'

const FOLLOWUP_SYSTEM_PROMPT = `You are a follow-up interview agent. Listen actively and decide next action.
Probe incomplete answers with one focused follow-up. Move on when the answer is sufficient.
Close when all questions are covered. Return structured JSON only.`

function trimHistory(input: FollowUpInput) {
  return input.conversationHistory.slice(-3)
}

export async function runFollowupAgent(
  input: FollowUpInput,
  context: { attemptId: string; userId: string }
): Promise<FollowUpDecision> {
  FollowUpInputSchema.parse(input)
  const started = Date.now()
  const runId = await createAgentRun({
    attemptId: context.attemptId,
    userId: context.userId,
    agentName: 'followup',
    input: {
      questionIndex: input.currentQuestion.index,
      answerLength: input.answerTranscript.length,
    },
    modelUsed: 'gemini-2.5-flash',
  })

  try {
    const result = await runAgentWithRetry(async () => {
      const history = trimHistory(input)
      const userPrompt = `Current question: ${input.currentQuestion.text}
Candidate answer: ${input.answerTranscript}
Recent turns:
${history.map((t) => `${t.role}: ${t.content}`).join('\n')}
Decide: FOLLOW_UP with one question, NEXT_QUESTION, or CLOSE_INTERVIEW.`

      const { output } = await generateStructured(
        FollowUpDecisionSchema,
        FOLLOWUP_SYSTEM_PROMPT,
        userPrompt,
        { name: 'FollowUpDecision', description: 'Next interview action' }
      )
      return FollowUpDecisionSchema.parse(output)
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

export function getFollowupSystemPromptLength(): number {
  return FOLLOWUP_SYSTEM_PROMPT.length
}
