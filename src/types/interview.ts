import type { Timestamp } from 'firebase-admin/firestore'

export interface Interview {
  id: string
  userId: string
  role: string
  description: string
  experience: number
  difficulty: 'junior' | 'mid' | 'senior' | 'staff'
  techStack: string[]
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Question {
  id: string
  interviewId: string
  index: number
  text: string
  type: 'technical' | 'behavioral' | 'situational' | 'followup'
  expectedAnswer: string
  keyPoints: string[]
  maxScore: number
  rubricVersion: string
}

export interface TranscriptEvent {
  id: string
  attemptId: string
  role: 'candidate' | 'interviewer'
  content: string
  questionIndex: number
  agentName?: string
  timestamp: Timestamp
}

export interface EvaluationResult {
  attemptId: string
  overallScore: number
  maxScore: number
  percentageScore: number
  perQuestionScores: QuestionScore[]
  strengths: string[]
  areasForImprovement: string[]
  rubricVersion: string
  evaluatedAt: Timestamp
}

export interface QuestionScore {
  questionIndex: number
  score: number
  maxScore: number
  feedback: string
  evidenceQuotes: string[]
}

export interface FeedbackReport {
  id: string
  attemptId: string
  evaluation: EvaluationResult
  practicePlan: PracticePlan
  generatedAt: Timestamp
  isPublic: boolean
  publicSlug?: string
}

export interface PracticePlan {
  summary: string
  weeklyGoals: WeeklyGoal[]
  resources: Resource[]
  focusAreas: string[]
  estimatedImprovementWeeks: number
}

export interface WeeklyGoal {
  week: number
  goal: string
  tasks: string[]
}

export interface Resource {
  title: string
  url: string
  type: 'article' | 'video' | 'course' | 'book' | 'practice'
  focusArea: string
}

export interface AgentRun {
  id: string
  attemptId: string
  userId: string
  agentName: 'planner' | 'question' | 'followup' | 'evaluator' | 'coach' | 'guard'
  status: 'RUNNING' | 'COMPLETE' | 'FAILED'
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  error: string | null
  durationMs: number
  tokenCount: number | null
  modelUsed: string
  startedAt: Timestamp
  completedAt: Timestamp | null
}

export interface RubricItem {
  skill: string
  description: string
  maxPoints: number
  criteria: string[]
}
