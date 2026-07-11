"use client"

import { useEffect, useState } from "react"
import {
  BellIcon,
  FlameIcon,
  MicIcon,
  PanelLeftIcon,
  SearchIcon,
} from "lucide-react"

import { allNavItems } from "@/components/shared/nav-config"
import { UserMenu } from "@/components/shared/UserMenu"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/shared/Sidebar"

type TopBarProps = {
  pathname: string
  user: {
    name: string
    email: string
    imageUrl?: string
  }
  streakDays?: number
}

export function TopBar({ pathname, user, streakDays = 8 }: TopBarProps) {
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <header className="flex h-[var(--product-topbar-height)] shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
              <PanelLeftIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[var(--product-sidebar-width)] p-0">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle>MockAI</SheetTitle>
            </SheetHeader>
            <Sidebar user={user} pathname={pathname} />
          </SheetContent>
        </Sheet>

        <button
          type="button"
          className="product-topbar-search hidden sm:flex"
          onClick={() => setCommandOpen(true)}
          aria-label="Search"
        >
          <SearchIcon className="size-4 shrink-0" />
          <span className="truncate">Search interviews, skills, feedback...</span>
          <kbd className="ml-auto hidden rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
            ⌘K
          </kbd>
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setCommandOpen(true)}
          aria-label="Search"
        >
          <SearchIcon />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 sm:flex">
            <FlameIcon className="size-3.5" />
            {streakDays} Day streak
          </div>

          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <BellIcon />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
          </Button>

          <UserMenu user={user} variant="compact" />
        </div>
      </header>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search interviews, skills, feedback..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <CommandItem
              onSelect={() => {
                setCommandOpen(false)
                window.location.href = "/interview/new"
              }}
            >
              <MicIcon />
              Start new interview
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Pages">
            {allNavItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  setCommandOpen(false)
                  window.location.href = item.href
                }}
              >
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
