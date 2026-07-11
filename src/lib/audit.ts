import { FieldValue } from 'firebase-admin/firestore'

import { adminDb } from '@/lib/firebase-admin'

export type AuditAction =
  | 'create_interview'
  | 'list_interviews'
  | 'get_interview'
  | 'delete_interview'
  | 'start_attempt'
  | 'list_attempts'
  | 'get_attempt'
  | 'agent_step'
  | 'complete_attempt'
  | 'get_feedback'
  | 'export_feedback_pdf'
  | 'share_feedback'
  | 'sync_transcript'
  | 'public_feedback'
  | 'auth_session'
  | 'auth_sign_out'

export async function writeAuditLog(event: {
  userId: string
  action: AuditAction
  resourceId: string
  ip: string
  userAgent: string
  success: boolean
  errorCode?: string
}): Promise<void> {
  try {
    await adminDb.collection('auditLogs').add({
      ...event,
      timestamp: FieldValue.serverTimestamp(),
    })
  } catch {
    // Audit failures must not block the primary request
  }
}

export function getClientInfo(request: Request): { ip: string; userAgent: string } {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip =
    forwarded?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const userAgent = request.headers.get('user-agent') ?? 'unknown'
  return { ip, userAgent }
}
