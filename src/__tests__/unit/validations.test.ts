import { describe, expect, it } from 'vitest'

import {
  agentStepSchema,
  createAttemptSchema,
  syncTranscriptSchema,
} from '@/lib/validations/attempt'
import {
  createInterviewSchema,
  transcriptEventSchema,
} from '@/lib/validations/interview'

describe('createInterviewSchema', () => {
  const valid = {
    role: 'Frontend Engineer',
    description: 'Building React applications with TypeScript and Next.js.',
    experience: 5,
    difficulty: 'senior' as const,
    techStack: ['React', 'TypeScript'],
  }

  it('accepts valid interview input', () => {
    expect(createInterviewSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects role shorter than 2 characters', () => {
    const result = createInterviewSchema.safeParse({ ...valid, role: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects empty tech stack', () => {
    const result = createInterviewSchema.safeParse({ ...valid, techStack: [] })
    expect(result.success).toBe(false)
  })

  it('rejects invalid difficulty', () => {
    const result = createInterviewSchema.safeParse({ ...valid, difficulty: 'expert' })
    expect(result.success).toBe(false)
  })
})

describe('transcriptEventSchema', () => {
  it('accepts valid transcript event', () => {
    const result = transcriptEventSchema.safeParse({
      attemptId: 'attempt-1',
      role: 'candidate',
      content: 'I used Redis for caching.',
      questionIndex: 0,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty content', () => {
    const result = transcriptEventSchema.safeParse({
      attemptId: 'attempt-1',
      role: 'candidate',
      content: '',
      questionIndex: 0,
    })
    expect(result.success).toBe(false)
  })
})

describe('createAttemptSchema', () => {
  it('accepts valid attempt input', () => {
    expect(createAttemptSchema.safeParse({ interviewId: 'interview-1' }).success).toBe(true)
  })

  it('rejects empty interviewId', () => {
    expect(createAttemptSchema.safeParse({ interviewId: '' }).success).toBe(false)
  })
})

describe('agentStepSchema', () => {
  it('accepts empty body for planning steps', () => {
    expect(agentStepSchema.safeParse({}).success).toBe(true)
  })

  it('accepts optional candidate message', () => {
    expect(
      agentStepSchema.safeParse({ candidateMessage: 'My answer here.' }).success
    ).toBe(true)
  })

  it('rejects message over 5000 characters', () => {
    expect(
      agentStepSchema.safeParse({ candidateMessage: 'a'.repeat(5001) }).success
    ).toBe(false)
  })
})

describe('syncTranscriptSchema', () => {
  it('accepts valid transcript batch', () => {
    const result = syncTranscriptSchema.safeParse({
      events: [
        {
          id: 'e1',
          role: 'candidate',
          content: 'Answer text',
          questionIndex: 0,
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty events array', () => {
    expect(syncTranscriptSchema.safeParse({ events: [] }).success).toBe(false)
  })
})
