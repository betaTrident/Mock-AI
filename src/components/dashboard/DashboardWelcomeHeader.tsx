import Link from "next/link"
import { ChevronDownIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DashboardWelcomeHeaderProps = {
  userName: string
  onStartInterview: () => void
}

export function DashboardWelcomeHeader({ userName, onStartInterview }: DashboardWelcomeHeaderProps) {
  const firstName = userName.split(" ")[0] || userName

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {firstName}.
        </h1>
        <p className="text-sm text-muted-foreground">
          You&apos;re building steady interview momentum.
        </p>
      </div>

      <DropdownMenu>
        <div className="flex items-center gap-0">
          <Button onClick={onStartInterview} className="rounded-r-none">
            <PlusIcon data-icon="inline-start" />
            Start New Interview
          </Button>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-l-none border-l border-primary-foreground/20 px-2.5">
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onStartInterview}>Quick setup</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/interview/new">Full setup wizard</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
