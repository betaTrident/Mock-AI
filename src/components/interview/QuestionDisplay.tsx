import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type QuestionDisplayProps = {
  question: string
  questionIndex: number
  totalQuestions: number
  type?: "technical" | "behavioral" | "situational" | "followup"
}

const typeLabels = {
  technical: "Technical",
  behavioral: "Behavioral",
  situational: "Situational",
  followup: "Follow-up",
} as const

export function QuestionDisplay({
  question,
  questionIndex,
  totalQuestions,
  type = "technical",
}: QuestionDisplayProps) {
  const progress = totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{typeLabels[type]}</Badge>
          <CardDescription>
            Question {questionIndex + 1} of {totalQuestions}
          </CardDescription>
        </div>
        <CardTitle className="text-lg leading-relaxed">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} />
      </CardContent>
    </Card>
  )
}
