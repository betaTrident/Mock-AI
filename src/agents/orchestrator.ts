import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { runPlannerAgent } from '@/agents/planner.agent'
import { runQuestionAgent } from '@/agents/question.agent'
import { runFollowupAgent } from '@/agents/followup.agent'
import { runEvaluatorAgent } from '@/agents/evaluator.agent'
import { runCoachAgent } from '@/agents/coach.agent'
import { guardInput } from '@/agents/safety.guard'
import { adminDb } from '@/lib/firebase-admin'
import { sampleFewShotExamples } from '@/lib/question-bank'
import type { AttemptStatus } from '@/types/attempt'
import type { Interview, Question, TranscriptEvent } from '@/types/interview'
import type { PlannerOutput } from '@/lib/schemas/agents'

export interface AttemptDocument {
  id: string
  interviewId: string
  userId: string
  status: AttemptStatus
  currentQuestionIndex: number
  questions: Question[]
  transcriptEvents: TranscriptEvent[]
  plannerOutput: PlannerOutput | null
  evaluation: Record<string, unknown> | null
  feedbackReport: Record<string, unknown> | null
  practicePlan: Record<string, unknown> | null
  startedAt: Timestamp | null
  completedAt: Timestamp | null
  metadata: Record<string, unknown>
}

export interface AgentStepInput {
  candidateMessage?: string
}

export interface AgentStepResult {
  status: AttemptStatus
  responseText?: string
  currentQuestion?: Question
  currentQuestionIndex: number
  totalQuestions: number
  followUpType?: string
}

function toTranscriptEvent(
  attemptId: string,
  role: 'candidate' | 'interviewer',
  content: string,
  questionIndex: number,
  agentName?: string
): TranscriptEvent {
  return {
    id: `${attemptId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    attemptId,
    role,
    content,
    questionIndex,
    agentName,
    timestamp: Timestamp.now(),
  }
}

async function updateAttempt(
  attemptId: string,
  data: Record<string, unknown>
): Promise<void> {
  await adminDb.collection('attempts').doc(attemptId).update(data)
}

export async function runPlanningPhase(
  attempt: AttemptDocument,
  interview: Interview
): Promise<AttemptDocument> {
  await updateAttempt(attempt.id, { status: 'PLANNING' })

  const plannerOutput = await runPlannerAgent(
    {
      role: interview.role,
      description: interview.description,
      experience: interview.experience,
      difficulty: interview.difficulty,
      techStack: interview.techStack,
    },
    { attemptId: attempt.id, userId: attempt.userId }
  )

  const fewShotExamples = sampleFewShotExamples(
    interview.role,
    interview.difficulty,
    4
  )

  const questions = await runQuestionAgent(
    {
      ...plannerOutput,
      interviewId: interview.id,
      fewShotExamples,
    },
    { attemptId: attempt.id, userId: attempt.userId }
  )

  await updateAttempt(attempt.id, {
    status: 'READY',
    questions,
    plannerOutput,
    metadata: {
      ...attempt.metadata,
      fewShotExampleCount: fewShotExamples.length,
    },
  })

  return {
    ...attempt,
    status: 'READY',
    questions,
    plannerOutput,
  }
}

export async function advanceAttempt(
  attempt: AttemptDocument,
  interview: Interview,
  input: AgentStepInput = {}
): Promise<AgentStepResult> {
  switch (attempt.status) {
    case 'PENDING':
    case 'PLANNING': {
      const updated = await runPlanningPhase(attempt, interview)
      const firstQuestion = updated.questions[0]
      return {
        status: 'READY',
        responseText: firstQuestion
          ? `Welcome! Let's begin. ${firstQuestion.text}`
          : 'Interview plan is ready.',
        currentQuestion: firstQuestion,
        currentQuestionIndex: 0,
        totalQuestions: updated.questions.length,
      }
    }

    case 'READY': {
      const firstQuestion = attempt.questions[0]
      await updateAttempt(attempt.id, {
        status: 'IN_PROGRESS',
        startedAt: FieldValue.serverTimestamp(),
        currentQuestionIndex: 0,
      })
      const greeting = firstQuestion
        ? `Welcome! Let's begin. ${firstQuestion.text}`
        : 'Ready to start.'
      const events = [
        ...attempt.transcriptEvents,
        toTranscriptEvent(attempt.id, 'interviewer', greeting, 0, 'question'),
      ]
      await updateAttempt(attempt.id, { transcriptEvents: events })
      return {
        status: 'IN_PROGRESS',
        responseText: greeting,
        currentQuestion: firstQuestion,
        currentQuestionIndex: 0,
        totalQuestions: attempt.questions.length,
      }
    }

    case 'IN_PROGRESS': {
      if (!input.candidateMessage?.trim()) {
        const current = attempt.questions[attempt.currentQuestionIndex]
        return {
          status: 'IN_PROGRESS',
          responseText: current?.text,
          currentQuestion: current,
          currentQuestionIndex: attempt.currentQuestionIndex,
          totalQuestions: attempt.questions.length,
        }
      }

      const guard = await guardInput(input.candidateMessage)
      if (!guard.safe) {
        return {
          status: 'IN_PROGRESS',
          responseText: 'Please keep your answer focused on the interview question.',
          currentQuestion: attempt.questions[attempt.currentQuestionIndex],
          currentQuestionIndex: attempt.currentQuestionIndex,
          totalQuestions: attempt.questions.length,
          followUpType: guard.reason,
        }
      }

      const questionIndex = attempt.currentQuestionIndex
      const currentQuestion = attempt.questions[questionIndex]
      const candidateEvent = toTranscriptEvent(
        attempt.id,
        'candidate',
        input.candidateMessage,
        questionIndex
      )

      const history = [...attempt.transcriptEvents, candidateEvent].map((e) => ({
        role: e.role,
        content: e.content,
        questionIndex: e.questionIndex,
      }))

      const decision = await runFollowupAgent(
        {
          currentQuestion,
          answerTranscript: input.candidateMessage,
          conversationHistory: history,
        },
        { attemptId: attempt.id, userId: attempt.userId }
      )

      let responseText = ''
      let nextIndex = questionIndex
      let nextStatus: AttemptStatus = 'IN_PROGRESS'
      const newEvents: TranscriptEvent[] = [candidateEvent]

      if (decision.type === 'FOLLOW_UP') {
        responseText = decision.question
        newEvents.push(
          toTranscriptEvent(
            attempt.id,
            'interviewer',
            decision.question,
            questionIndex,
            'followup'
          )
        )
      } else if (decision.type === 'NEXT_QUESTION') {
        nextIndex = questionIndex + 1
        if (nextIndex >= attempt.questions.length) {
          nextStatus = 'EVALUATING'
          responseText = 'Thank you for your answers. I am preparing your feedback.'
        } else {
          const nextQuestion = attempt.questions[nextIndex]
          responseText = `Great. Next question: ${nextQuestion.text}`
          newEvents.push(
            toTranscriptEvent(
              attempt.id,
              'interviewer',
              responseText,
              nextIndex,
              'question'
            )
          )
        }
      } else {
        nextStatus = 'EVALUATING'
        responseText = 'Thank you for completing the interview. I am preparing your feedback.'
      }

      await updateAttempt(attempt.id, {
        status: nextStatus,
        currentQuestionIndex: nextIndex,
        transcriptEvents: [...attempt.transcriptEvents, ...newEvents],
      })

      if (nextStatus === 'EVALUATING') {
        return runEvaluationPhase(
          { ...attempt, status: nextStatus, currentQuestionIndex: nextIndex },
          interview
        )
      }

      return {
        status: nextStatus,
        responseText,
        currentQuestion: attempt.questions[nextIndex],
        currentQuestionIndex: nextIndex,
        totalQuestions: attempt.questions.length,
        followUpType: decision.type,
      }
    }

    case 'EVALUATING':
    case 'COACHING':
      return runEvaluationPhase(attempt, interview)

    case 'COMPLETE':
      return {
        status: 'COMPLETE',
        currentQuestionIndex: attempt.currentQuestionIndex,
        totalQuestions: attempt.questions.length,
        responseText: 'Interview complete. View your feedback report.',
      }

    case 'FAILED':
      return {
        status: 'FAILED',
        currentQuestionIndex: attempt.currentQuestionIndex,
        totalQuestions: attempt.questions.length,
        responseText: 'Interview failed. Please try again.',
      }

    default:
      return {
        status: attempt.status,
        currentQuestionIndex: attempt.currentQuestionIndex,
        totalQuestions: attempt.questions.length,
      }
  }
}

export async function completeAttempt(
  attempt: AttemptDocument,
  interview: Interview
): Promise<AgentStepResult> {
  if (attempt.status === 'COMPLETE') {
    return {
      status: 'COMPLETE',
      currentQuestionIndex: attempt.currentQuestionIndex,
      totalQuestions: attempt.questions.length,
      responseText: 'Interview already complete.',
    }
  }

  if (attempt.status === 'IN_PROGRESS' || attempt.status === 'READY') {
    await updateAttempt(attempt.id, { status: 'EVALUATING' })
    return runEvaluationPhase(
      { ...attempt, status: 'EVALUATING' },
      interview
    )
  }

  return advanceAttempt(attempt, interview)
}

async function runEvaluationPhase(
  attempt: AttemptDocument,
  interview: Interview
): Promise<AgentStepResult> {
  if (attempt.status === 'COMPLETE') {
    return {
      status: 'COMPLETE',
      currentQuestionIndex: attempt.currentQuestionIndex,
      totalQuestions: attempt.questions.length,
      responseText: 'Interview complete.',
    }
  }

  await updateAttempt(attempt.id, { status: 'EVALUATING' })

  const rubric = attempt.plannerOutput?.rubric ?? []
  const evaluation = await runEvaluatorAgent(
    {
      attemptId: attempt.id,
      transcript: attempt.transcriptEvents.map((e) => ({
        role: e.role,
        content: e.content,
        questionIndex: e.questionIndex,
      })),
      questions: attempt.questions,
      rubric,
    },
    { attemptId: attempt.id, userId: attempt.userId }
  )

  await updateAttempt(attempt.id, {
    status: 'COACHING',
    evaluation: { ...evaluation, evaluatedAt: Timestamp.now() },
  })

  const weakAreas = evaluation.areasForImprovement.slice(0, 3)
  const practicePlan = await runCoachAgent(
    { evaluation, role: interview.role, weakAreas },
    { attemptId: attempt.id, userId: attempt.userId }
  )

  const feedbackReport = {
    id: `${attempt.id}-feedback`,
    attemptId: attempt.id,
    evaluation: { ...evaluation, evaluatedAt: Timestamp.now() },
    practicePlan,
    generatedAt: Timestamp.now(),
    isPublic: false,
  }

  await updateAttempt(attempt.id, {
    status: 'COMPLETE',
    practicePlan,
    feedbackReport,
    completedAt: FieldValue.serverTimestamp(),
  })

  return {
    status: 'COMPLETE',
    responseText: 'Your feedback report is ready.',
    currentQuestionIndex: attempt.currentQuestionIndex,
    totalQuestions: attempt.questions.length,
  }
}
