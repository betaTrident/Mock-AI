"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PracticePlanCard, type PracticePlanData } from "@/components/interview/PracticePlanCard"
import { ScoreCard, type ScoreCardData } from "@/components/interview/ScoreCard"
import { ScoreReveal } from "@/components/interview/ScoreReveal"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

export type FeedbackReportData = {
  overallScore: number
  maxScore: number
  percentageScore: number
  perQuestionScores: ScoreCardData[]
  strengths: string[]
  areasForImprovement: string[]
  practicePlan: PracticePlanData
}

type FeedbackReportProps = {
  report: FeedbackReportData
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function FeedbackReport({ report }: FeedbackReportProps) {
  const chartData = report.perQuestionScores.map((q) => ({
    question: `Q${q.questionIndex + 1}`,
    score: q.score,
    max: q.maxScore,
  }))

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardDescription>Overall Score</CardDescription>
          <CardTitle className="text-5xl font-bold tabular-nums text-primary">
            <ScoreReveal value={report.percentageScore} />
          </CardTitle>
          <CardDescription>
            {report.overallScore} / {report.maxScore} points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="question" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="var(--color-score)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="breakdown">
          <AccordionTrigger>Per-question breakdown</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {report.perQuestionScores.map((score) => (
                <ScoreCard key={score.questionIndex} data={score} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="ml-4 flex list-disc flex-col gap-2 text-sm text-muted-foreground">
              {report.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="ml-4 flex list-disc flex-col gap-2 text-sm text-muted-foreground">
              {report.areasForImprovement.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <PracticePlanCard plan={report.practicePlan} />
    </div>
  )
}
