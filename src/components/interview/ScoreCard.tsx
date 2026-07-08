import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export type ScoreCardData = {
  questionIndex: number
  questionText: string
  score: number
  maxScore: number
  feedback: string
}

type ScoreCardProps = {
  data: ScoreCardData
}

export function ScoreCard({ data }: ScoreCardProps) {
  const percent = data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">Question {data.questionIndex + 1}</CardTitle>
          <Badge variant={percent >= 70 ? "default" : percent >= 50 ? "secondary" : "outline"}>
            {data.score}/{data.maxScore}
          </Badge>
        </div>
        <CardDescription>{data.questionText}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress value={percent} />
        <p className="text-sm text-muted-foreground">{data.feedback}</p>
      </CardContent>
    </Card>
  )
}
