import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { LANDING_CARD } from "./landing-styles"

type FeatureCardProps = {
  children: ReactNode
  className?: string
  title?: string
}

export function FeatureCard({ children, className, title }: FeatureCardProps) {
  return (
    <article
      className={cn(
        LANDING_CARD,
        "flex h-full flex-col overflow-hidden p-4 sm:p-5",
        className
      )}
    >
      {title ? (
        <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      ) : null}
      {children}
    </article>
  )
}
