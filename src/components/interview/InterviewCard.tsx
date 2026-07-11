"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export type InterviewCardData = {
  id: string
  role: string
  difficulty: "junior" | "mid" | "senior" | "staff"
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  techStack: string[]
  progressPercent: number
  lastAttemptScore?: number
}

const difficultyLabels = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  staff: "Staff",
} as const

const statusVariants = {
  DRAFT: "secondary",
  ACTIVE: "default",
  ARCHIVED: "outline",
} as const

type InterviewCardProps = {
  interview: InterviewCardData
}

export function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{interview.role}</CardTitle>
            <Badge variant={statusVariants[interview.status]}>{interview.status}</Badge>
          </div>
          <CardDescription>{difficultyLabels[interview.difficulty]} interview</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1">
            {interview.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{interview.progressPercent}%</span>
            </div>
            <Progress value={interview.progressPercent} aria-label={`${interview.progressPercent}% complete`} />
          </div>
          {interview.lastAttemptScore !== undefined ? (
            <p className="text-sm text-muted-foreground">
              Last score:{" "}
              <span className="font-medium text-foreground">{interview.lastAttemptScore}%</span>
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/interview/${interview.id}`} aria-label={`Continue ${interview.role} interview`}>
              Continue
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
