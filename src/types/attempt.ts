import type { Timestamp } from 'firebase-admin/firestore'
import type {
  AgentRun,
  EvaluationResult,
  FeedbackReport,
  PracticePlan,
  Question,
  TranscriptEvent,
} from '@/types/interview'

export type AttemptStatus =
  | 'PENDING'
  | 'PLANNING'
  | 'READY'
  | 'IN_PROGRESS'
  | 'EVALUATING'
  | 'COACHING'
  | 'COMPLETE'
  | 'FAILED'

export interface AttemptState {
  id: string
  interviewId: string
  userId: string
  status: AttemptStatus
  currentQuestionIndex: number
  questions: Question[]
  transcriptEvents: TranscriptEvent[]
  agentRuns: AgentRun[]
  evaluation: EvaluationResult | null
  feedbackReport: FeedbackReport | null
  practicePlan: PracticePlan | null
  startedAt: Timestamp
  completedAt: Timestamp | null
  metadata: Record<string, unknown>
}
