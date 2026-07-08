import { z } from 'zod'

export const RubricItemSchema = z.object({
  skill: z.string(),
  description: z.string(),
  maxPoints: z.number(),
  criteria: z.array(z.string()),
})

export const PlannerInputSchema = z.object({
  role: z.string(),
  description: z.string(),
  experience: z.number(),
  difficulty: z.string(),
  techStack: z.array(z.string()),
})

export const PlannerOutputSchema = z.object({
  role: z.string(),
  strategy: z.string(),
  topics: z.array(z.string()),
  rubric: z.array(RubricItemSchema),
  questionCount: z.number().int().min(3).max(8),
})

export const QuestionSchema = z.object({
  id: z.string(),
  interviewId: z.string(),
  index: z.number().int().min(0),
  text: z.string().min(1),
  type: z.enum(['technical', 'behavioral', 'situational', 'followup']),
  expectedAnswer: z.string(),
  keyPoints: z.array(z.string()),
  maxScore: z.number().int().positive(),
  rubricVersion: z.string(),
})

export const QuestionListSchema = z.object({
  questions: z.array(QuestionSchema).min(1),
})

export const QuestionAgentInputSchema = PlannerOutputSchema.extend({
  interviewId: z.string(),
  fewShotExamples: z.array(
    z.object({
      question: z.string(),
      category: z.string(),
      idealAnswer: z.string(),
      keywords: z.array(z.string()),
      difficulty: z.string(),
      role: z.string(),
    })
  ),
})

export const FollowUpInputSchema = z.object({
  currentQuestion: QuestionSchema,
  answerTranscript: z.string().min(1),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['candidate', 'interviewer']),
      content: z.string(),
      questionIndex: z.number(),
    })
  ),
})

export const FollowUpDecisionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('FOLLOW_UP'),
    question: z.string(),
    reason: z.string(),
  }),
  z.object({ type: z.literal('NEXT_QUESTION') }),
  z.object({ type: z.literal('CLOSE_INTERVIEW') }),
])

export const EvaluatorInputSchema = z.object({
  attemptId: z.string(),
  transcript: z.array(
    z.object({
      role: z.enum(['candidate', 'interviewer']),
      content: z.string(),
      questionIndex: z.number(),
    })
  ),
  questions: z.array(QuestionSchema),
  rubric: z.array(RubricItemSchema),
})

export const EvaluationResultSchema = z.object({
  attemptId: z.string(),
  overallScore: z.number(),
  maxScore: z.number(),
  percentageScore: z.number(),
  perQuestionScores: z.array(
    z.object({
      questionIndex: z.number(),
      score: z.number(),
      maxScore: z.number(),
      feedback: z.string(),
      evidenceQuotes: z.array(z.string()),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  rubricVersion: z.string(),
})

export const CoachInputSchema = z.object({
  evaluation: EvaluationResultSchema,
  role: z.string(),
  weakAreas: z.array(z.string()),
})

export const PracticePlanSchema = z.object({
  summary: z.string(),
  weeklyGoals: z.array(
    z.object({
      week: z.number(),
      goal: z.string(),
      tasks: z.array(z.string()),
    })
  ),
  resources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['article', 'video', 'course', 'book', 'practice']),
      focusArea: z.string(),
    })
  ),
  focusAreas: z.array(z.string()),
  estimatedImprovementWeeks: z.number(),
})

export type PlannerInput = z.infer<typeof PlannerInputSchema>
export type PlannerOutput = z.infer<typeof PlannerOutputSchema>
export type QuestionAgentInput = z.infer<typeof QuestionAgentInputSchema>
export type FollowUpInput = z.infer<typeof FollowUpInputSchema>
export type FollowUpDecision = z.infer<typeof FollowUpDecisionSchema>
export type EvaluatorInput = z.infer<typeof EvaluatorInputSchema>
export type EvaluationResultOutput = z.infer<typeof EvaluationResultSchema>
export type CoachInput = z.infer<typeof CoachInputSchema>
export type PracticePlanOutput = z.infer<typeof PracticePlanSchema>
