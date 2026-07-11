import { cn } from "@/lib/utils"

type StatusTone = "success" | "warning" | "danger" | "info" | "neutral"

type StatusBadgeProps = {
  children: React.ReactNode
  tone?: StatusTone
  className?: string
}

const toneClass: Record<StatusTone, string> = {
  success: "product-status-badge--success",
  warning: "product-status-badge--warning",
  danger: "product-status-badge--danger",
  info: "product-status-badge--info",
  neutral: "product-status-badge--neutral",
}

export function StatusBadge({ children, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <span className={cn("product-status-badge", toneClass[tone], className)}>
      {children}
    </span>
  )
}
