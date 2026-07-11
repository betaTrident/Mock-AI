import Link from "next/link"
import { PlayCircleIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type DashboardOnboardingCtaProps = {
  onStartInterview: () => void
}

export function DashboardOnboardingCta({ onStartInterview }: DashboardOnboardingCtaProps) {
  return (
    <div className="product-panel overflow-hidden">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <SparklesIcon className="size-5" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">New to MockAI?</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>AI-powered mock interviews tailored to your role</li>
              <li>Personalized feedback after every session</li>
              <li>Track progress across skills and scores</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onStartInterview}>
            <PlayCircleIcon data-icon="inline-start" />
            Start New Interview
          </Button>
          <Button variant="outline" asChild>
            <Link href="/#how-it-works">Learn how it works</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
