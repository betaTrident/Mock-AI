import Link from "next/link"

import { cn } from "@/lib/utils"

type ProductLogoProps = {
  className?: string
}

export function ProductLogo({ className }: ProductLogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="MockAI dashboard"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
        <span className="text-sm font-bold text-primary">M</span>
      </span>
      <span className="text-base font-semibold tracking-tight">MockAI</span>
    </Link>
  )
}
