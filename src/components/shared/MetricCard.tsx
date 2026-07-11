import { cn } from "@/lib/utils"

type MetricCardProps = {
  label: string
  value: React.ReactNode
  trend?: {
    direction: "up" | "down" | "neutral"
    label: string
  }
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ label, value, trend, icon, className }: MetricCardProps) {
  return (
    <div className={cn("product-metric-card", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="product-metric-label">{label}</span>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
      <div className="product-metric-value">{value}</div>
      {trend ? (
        <p
          className={cn(
            trend.direction === "up" && "product-metric-trend-up",
            trend.direction === "down" && "product-metric-trend-down",
            trend.direction === "neutral" && "text-xs text-muted-foreground"
          )}
        >
          {trend.label}
        </p>
      ) : null}
    </div>
  )
}
