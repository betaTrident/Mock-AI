"use client"

import { usePathname } from "next/navigation"

import { AppShell } from "@/components/shared/AppShell"
import { PageTransition } from "@/components/shared/PageTransition"

type AppLayoutClientProps = {
  children: React.ReactNode
  user: {
    name: string
    email: string
    imageUrl?: string
  }
}

function isLiveInterviewRoute(pathname: string) {
  return /^\/interview\/[^/]+$/.test(pathname)
}

export function AppLayoutClient({ children, user }: AppLayoutClientProps) {
  const pathname = usePathname()
  const fullBleed = isLiveInterviewRoute(pathname)

  return (
    <AppShell user={user} fullBleed={fullBleed}>
      <PageTransition>{children}</PageTransition>
    </AppShell>
  )
}
