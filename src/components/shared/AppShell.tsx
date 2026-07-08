"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  MicIcon,
  PanelLeftIcon,
  UserIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/shared/Sidebar"

type AppShellProps = {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    imageUrl?: string
  }
}

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:flex lg:flex-col">
        <Sidebar user={user} pathname={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-2 border-b border-border px-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <PanelLeftIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle>MockAI</SheetTitle>
              </SheetHeader>
              <Sidebar user={user} pathname={pathname} />
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="font-semibold">
            MockAI
          </Link>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/interview/new", label: "New Interview", icon: MicIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
] as const

export function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string
  label: string
  icon: React.ComponentType
  pathname: string
}) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon />
      {label}
    </Link>
  )
}

export function AppShellDivider() {
  return <Separator className="my-2" />
}
