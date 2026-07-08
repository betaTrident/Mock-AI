import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { adminDb } from '@/lib/firebase-admin'
import type { AgentName } from '@/types/agent'

export interface AgentRunRecord {
  id: string
  attemptId: string
  userId: string
  agentName: AgentName
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

export async function createAgentRun(params: {
  attemptId: string
  userId: string
  agentName: AgentName
  input: Record<string, unknown>
  modelUsed: string
}): Promise<string> {
  const ref = adminDb.collection('agentRuns').doc()
  await ref.set({
    id: ref.id,
    attemptId: params.attemptId,
    userId: params.userId,
    agentName: params.agentName,
    status: 'RUNNING',
    input: params.input,
    output: null,
    error: null,
    durationMs: 0,
    tokenCount: null,
    modelUsed: params.modelUsed,
    startedAt: FieldValue.serverTimestamp(),
    completedAt: null,
  })
  return ref.id
}

export async function completeAgentRun(
  runId: string,
  result: {
    output: Record<string, unknown>
    durationMs: number
    tokenCount: number | null
  }
): Promise<void> {
  await adminDb.collection('agentRuns').doc(runId).update({
    status: 'COMPLETE',
    output: result.output,
    durationMs: result.durationMs,
    tokenCount: result.tokenCount,
    completedAt: FieldValue.serverTimestamp(),
  })
}

export async function failAgentRun(
  runId: string,
  error: string,
  durationMs: number
): Promise<void> {
  await adminDb.collection('agentRuns').doc(runId).update({
    status: 'FAILED',
    error,
    durationMs,
    completedAt: FieldValue.serverTimestamp(),
  })
}
