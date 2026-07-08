import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type PracticePlanData = {
  summary: string
  focusAreas: string[]
  estimatedImprovementWeeks: number
  weeklyGoals: Array<{
    week: number
    goal: string
    tasks: string[]
  }>
  resources: Array<{
    title: string
    url: string
    type: "article" | "video" | "course" | "book" | "practice"
    focusArea: string
  }>
}

type PracticePlanCardProps = {
  plan: PracticePlanData
}

export function PracticePlanCard({ plan }: PracticePlanCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Plan</CardTitle>
        <CardDescription>
          {plan.estimatedImprovementWeeks}-week improvement roadmap from your Coach agent
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm">{plan.summary}</p>

        <div className="flex flex-wrap gap-1">
          {plan.focusAreas.map((area) => (
            <Badge key={area} variant="secondary">
              {area}
            </Badge>
          ))}
        </div>

        <Accordion type="single" collapsible>
          {plan.weeklyGoals.map((week) => (
            <AccordionItem key={week.week} value={`week-${week.week}`}>
              <AccordionTrigger>Week {week.week}: {week.goal}</AccordionTrigger>
              <AccordionContent>
                <ul className="ml-4 flex list-disc flex-col gap-1 text-sm text-muted-foreground">
                  {week.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {plan.resources.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Resources</p>
            <ul className="flex flex-col gap-1 text-sm">
              {plan.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {resource.title}
                  </a>
                  <span className="text-muted-foreground"> — {resource.focusArea}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
