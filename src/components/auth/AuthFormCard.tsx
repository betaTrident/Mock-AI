import { cn } from "@/lib/utils"

import { AUTH_PANEL } from "./auth-styles"

type AuthFormCardProps = {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function AuthFormCard({ title, description, children, className }: AuthFormCardProps) {
  return (
    <div className={cn(AUTH_PANEL, "p-6 sm:p-8", className)}>
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description ? (
          <p className="text-sm leading-relaxed text-slate-400">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
