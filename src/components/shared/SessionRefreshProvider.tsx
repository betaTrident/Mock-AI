'use client'

import { useSessionRefresh } from '@/features/auth'

export function SessionRefreshProvider({ children }: { children: React.ReactNode }) {
  useSessionRefresh()
  return children
}
