import { SparklesIcon } from "lucide-react"

import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import type { InterviewSetupData } from "@/components/interview/InterviewSetupWizard"

export type InterviewTypeOption = "behavioral" | "technical" | "system_design" | "mixed"

type InterviewCoachPreviewProps = {
  form: InterviewSetupData
  interviewType: InterviewTypeOption
  onGenerate: () => void
  isSubmitting?: boolean
  canGenerate: boolean
}

const TYPE_TOPICS: Record<InterviewTypeOption, string[]> = {
  behavioral: ["Leadership", "Conflict resolution", "STAR stories", "Team collaboration"],
  technical: ["Fundamentals", "Problem solving", "Code design", "Debugging"],
  system_design: ["Scalability", "Trade-offs", "Data modeling", "Reliability"],
  mixed: ["Behavioral", "Technical depth", "Architecture", "Communication"],
}

function buildLikelyTopics(form: InterviewSetupData, interviewType: InterviewTypeOption) {
  const fromStack = form.techStack.slice(0, 4).map((tech) => `${tech} fundamentals`)
  const base = TYPE_TOPICS[interviewType]
  return [...new Set([...fromStack, ...base])].slice(0, 6)
}

function estimateDuration(difficulty: InterviewSetupData["difficulty"]) {
  if (difficulty === "junior") return "25 minutes"
  if (difficulty === "mid") return "30 minutes"
  if (difficulty === "senior") return "40 minutes"
  return "45 minutes"
}

export function InterviewCoachPreview({
  form,
  interviewType,
  onGenerate,
  isSubmitting,
  canGenerate,
}: InterviewCoachPreviewProps) {
  const topics = buildLikelyTopics(form, interviewType)
  const questionCount = form.difficulty === "staff" ? 14 : form.difficulty === "senior" ? 12 : 10

  return (
    <aside className="product-panel flex h-fit flex-col lg:sticky lg:top-6">
      <div className="product-panel-header">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">AI Coach Preview</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Live summary of how your interview will be generated.
        </p>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <section className="product-section">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Likely topics
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <StatusBadge key={topic} tone="neutral">
                {topic}
              </StatusBadge>
            ))}
          </div>
        </section>

        <section className="product-section">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Question style
          </h3>
          <p className="text-sm text-muted-foreground">
            {questionCount} questions with adaptive follow-ups based on your answers.
          </p>
        </section>

        <section className="product-section">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            AI follow-up behavior
          </h3>
          <p className="text-sm text-muted-foreground">
            The coach will probe deeper when answers are shallow and pivot when you demonstrate
            strong depth.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Estimated duration</p>
            <p className="mt-1 text-sm font-semibold">{estimateDuration(form.difficulty)}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Evaluation focus</p>
            <p className="mt-1 text-sm font-semibold">
              {form.techStack[0] ?? "Core skills"}, communication
            </p>
          </div>
        </section>
      </div>

      <div className="border-t border-border p-5">
        <p className="mb-3 text-sm text-muted-foreground">
          {canGenerate
            ? "AI is ready to generate your interview"
            : "Complete the required fields to generate your interview"}
        </p>
        <Button className="w-full" onClick={onGenerate} disabled={!canGenerate || isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Interview"}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Press Enter ↵</p>
      </div>
    </aside>
  )
}
