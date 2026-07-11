'use client'

import { useEffect } from 'react'

import { getClientAuth } from '@/lib/firebase-client'

export async function establishSession(idToken: string): Promise<boolean> {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Request': '1',
    },
    credentials: 'include',
    body: JSON.stringify({ idToken }),
  })
  return response.ok
}

export async function clearSession(): Promise<void> {
  await fetch('/api/auth/session', {
    method: 'DELETE',
    credentials: 'include',
  })
}

export function useSessionRefresh() {
  useEffect(() => {
    const auth = getClientAuth()
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) return
      const idToken = await user.getIdToken()
      await establishSession(idToken)
    })
    return unsubscribe
  }, [])
}
