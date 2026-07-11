import Link from "next/link"
import {
  CheckCircle2Icon,
  DownloadIcon,
  XCircleIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  IMPROVEMENTS,
  METRICS,
  PRACTICE_PLAN,
  STRENGTHS,
} from "./landing-data"
import {
  LANDING_CARD,
  LANDING_CARD_INNER,
  LANDING_CONTAINER,
  LANDING_SECTION,
} from "./landing-styles"
import { FadeUp } from "./motion"
import { ScoreGauge } from "./ScoreGauge"
import { SectionHeading } from "./SectionHeading"

const REPORT_NAV = [
  "Overview",
  "Score Breakdown",
  "Question Review",
  "Coaching Plan",
] as const

export function FeedbackReportSection() {
  return (
    <section id="feedback" className={cn(LANDING_SECTION, "relative")}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(59,130,246,0.08),transparent)]" />
      <div className={cn(LANDING_CONTAINER, "relative flex flex-col gap-14 lg:gap-16")}>
        <FadeUp>
          <SectionHeading
            eyebrow="Sample Report"
            title="Actionable feedback. Clear next steps."
          />
        </FadeUp>

        <FadeUp>
          <div
            className={cn(
              LANDING_CARD,
              "overflow-hidden shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)] ring-1 ring-blue-500/10"
            )}
          >
            <div className="grid lg:grid-cols-[240px_1fr]">
              <aside className="border-b border-white/[0.06] bg-[#020617]/50 p-6 lg:border-b-0 lg:border-r">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Frontend Engineer
                  </p>
                  <p className="text-xs text-slate-500">Technical Interview</p>
                  <p className="text-xs text-slate-500">Jul 8, 2026 · 42 min</p>
                </div>
                <div className="my-6 flex justify-center">
                  <ScoreGauge score={69} label="Good" size="lg" />
                </div>
                <Button
                  size="sm"
                  className="mb-6 w-full gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-400"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <DownloadIcon className="size-3.5" />
                  Download Report
                </Button>
                <nav className="space-y-1" aria-label="Report sections">
                  {REPORT_NAV.map((item, i) => (
                    <div
                      key={item}
                      className={cn(
                        "rounded-lg px-3 py-2 text-xs",
                        i === 0
                          ? "bg-blue-500/10 font-medium text-blue-400"
                          : "text-slate-500"
                      )}
                    >
                      {item}
                    </div>
                  ))}
                </nav>
              </aside>

              <div className="p-5 lg:p-7">
                <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {METRICS.map((m) => (
                    <div
                      key={m.label}
                      className={cn(LANDING_CARD_INNER, "p-3")}
                    >
                      <p className="text-[10px] text-slate-500">{m.label}</p>
                      <p className="text-xl font-bold tabular-nums text-white">
                        {m.score}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1.5 text-[10px]",
                          m.status === "good"
                            ? "border-emerald-500/40 text-emerald-400"
                            : "border-amber-500/40 text-amber-400"
                        )}
                      >
                        {m.status === "good" ? "Good" : "Needs work"}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className={cn(LANDING_CARD_INNER, "p-4")}>
                    <h4 className="mb-3 text-sm font-semibold text-emerald-400">
                      Top Strengths
                    </h4>
                    <ul className="space-y-2">
                      {STRENGTHS.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-xs text-slate-400"
                        >
                          <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={cn(LANDING_CARD_INNER, "p-4")}>
                    <h4 className="mb-3 text-sm font-semibold text-amber-400">
                      Areas to Improve
                    </h4>
                    <ul className="space-y-2">
                      {IMPROVEMENTS.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-xs text-slate-400"
                        >
                          <XCircleIcon className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={cn(LANDING_CARD_INNER, "p-4")}>
                    <h4 className="mb-3 text-sm font-semibold text-white">
                      Personalized Practice Plan
                    </h4>
                    <ol className="space-y-3">
                      {PRACTICE_PLAN.map((task, i) => (
                        <li key={task.title} className="text-xs">
                          <p className="font-medium text-slate-200">
                            {i + 1}. {task.title}
                          </p>
                          <p className="mt-0.5 text-slate-500">{task.detail}</p>
                          <Badge
                            variant="secondary"
                            className="mt-1.5 border-white/[0.06] bg-white/[0.05] text-[10px] text-slate-400"
                          >
                            {task.sessions} sessions
                          </Badge>
                        </li>
                      ))}
                    </ol>
                    <Link
                      href="#"
                      className="mt-3 inline-block text-xs font-medium text-blue-400 hover:underline"
                    >
                      View full plan →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
