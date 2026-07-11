export type PendingTranscriptEvent = {
  id: string
  role: 'candidate' | 'interviewer'
  content: string
  questionIndex: number
  agentName?: string
}

export async function syncTranscript(
  attemptId: string,
  events: PendingTranscriptEvent[]
): Promise<boolean> {
  if (events.length === 0) return true

  const response = await fetch(`/api/attempts/${attemptId}/sync-transcript`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ events }),
  })

  return response.ok
}

export const TRANSCRIPT_AUTO_SAVE_MS = 10_000
