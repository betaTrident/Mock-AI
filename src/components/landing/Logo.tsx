import Link from "next/link"

import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  showWordmark?: boolean
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="MockAI home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-500/30">
        <svg viewBox="0 0 24 24" className="size-4 text-blue-400" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C8.5 2 6 4.5 6 8v1H4v13h16V9h-2V8c0-3.5-2.5-6-6-6zm0 2c2.2 0 4 1.8 4 4v1H8V8c0-2.2 1.8-4 4-4zm-5 9h10v9H7v-9z"
          />
        </svg>
      </span>
      {showWordmark ? (
        <span className="text-lg font-semibold tracking-tight text-white">
          MockAI
        </span>
      ) : null}
    </Link>
  )
}
