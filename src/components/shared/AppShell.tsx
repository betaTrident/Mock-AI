"use client"

import { usePathname } from "next/navigation"

import { Sidebar } from "@/components/shared/Sidebar"
import { TopBar } from "@/components/shared/TopBar"
import { cn } from "@/lib/utils"

type AppShellProps = {
  children: React.ReactNode
  user: {
    name: string
    email: string
    imageUrl?: string
  }
  streakDays?: number
  /** Full-bleed pages (e.g. live interview) skip default page padding */
  fullBleed?: boolean
}

export function AppShell({ children, user, streakDays, fullBleed = false }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[var(--product-sidebar-width)] shrink-0 border-r border-border lg:flex lg:flex-col">
        <Sidebar user={user} pathname={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar pathname={pathname} user={user} streakDays={streakDays} />
        <main className={cn("flex-1", !fullBleed && "product-page-wide")}>{children}</main>
      </div>
    </div>
  )
}
