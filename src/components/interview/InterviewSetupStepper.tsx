import { cn } from "@/lib/utils"

const STEPS = [
  { id: "role", label: "Role" },
  { id: "details", label: "Details" },
  { id: "difficulty", label: "Difficulty" },
  { id: "review", label: "Review" },
] as const

export type SetupStep = (typeof STEPS)[number]["id"]

type InterviewSetupStepperProps = {
  currentStep: SetupStep
}

export function InterviewSetupStepper({ currentStep }: InterviewSetupStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep)

  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex
        const isActive = step.id === currentStep

        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                  isActive && "bg-primary text-primary-foreground",
                  isComplete && "bg-primary/20 text-primary",
                  !isActive && !isComplete && "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <span className="hidden h-px w-8 bg-border sm:block" aria-hidden="true" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

export const setupSteps = STEPS
