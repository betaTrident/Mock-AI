"use client"

import Link from "next/link"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { AppShellDivider, navItems, NavLink } from "@/components/shared/AppShell"
import { UserMenu } from "@/components/shared/UserMenu"
import { useEffect, useState } from "react"

type SidebarProps = {
  pathname: string
  user?: {
    name: string
    email: string
    imageUrl?: string
  }
}

export function Sidebar({ pathname, user }: SidebarProps) {
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 p-4">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          MockAI
        </Link>
        <Button
          variant="outline"
          size="icon-sm"
          className="hidden lg:inline-flex"
          onClick={() => setCommandOpen(true)}
          aria-label="Search"
        >
          <SearchIcon />
        </Button>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} pathname={pathname} />
        ))}
      </nav>

      <AppShellDivider />

      <div className="mt-auto p-4">
        <UserMenu
          user={
            user ?? {
              name: "Guest User",
              email: "guest@mockai.dev",
            }
          }
        />
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search interviews, pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {navItems.map((item) => (
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
    </div>
  )
}
