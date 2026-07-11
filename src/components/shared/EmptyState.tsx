import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center">
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action ? (
        <CardFooter className="justify-center">{action}</CardFooter>
      ) : actionLabel && onAction ? (
        <CardFooter className="justify-center">
          <Button onClick={onAction}>{actionLabel}</Button>
        </CardFooter>
      ) : (
        <CardContent />
      )}
    </Card>
  )
}
