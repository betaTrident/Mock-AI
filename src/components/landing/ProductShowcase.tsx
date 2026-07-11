"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import {
  IMPROVEMENTS,
  METRICS,
  SHOWCASE_QUESTION,
  STRENGTHS,
} from "./landing-data"
import { FeatureCard } from "./FeatureCard"
import { LANDING_CONTAINER, LANDING_SECTION } from "./landing-styles"
import { MetricBar } from "./MetricBar"
import { FadeUp, Stagger, StaggerItem } from "./motion"
import { ProgressChartCard } from "./ProgressChartCard"
import { ScoreGauge } from "./ScoreGauge"
import { SectionHeading } from "./SectionHeading"
import { VoiceRing } from "./VoiceVisualizer"

function SetupCard() {
  return (
    <FeatureCard title="Set up your interview">
      <div className="flex-1 space-y-2.5">
        {[
          { label: "Target Role", value: "Frontend Engineer" },
          { label: "Interview Type", value: "Technical Interview" },
          { label: "Difficulty", value: "Medium" },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              {field.label}
            </label>
            <div className="mt-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-200">
              {field.value}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
          <span className="text-xs text-slate-200">Enable Webcam</span>
          <span className="relative inline-flex h-5 w-9 rounded-full bg-blue-500">
            <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-white" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
          <span className="text-xs text-slate-200">Voice Input</span>
          <span className="relative inline-flex h-5 w-9 rounded-full bg-blue-500">
            <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-white" />
          </span>
        </div>
        <Button
          size="sm"
          className="mt-2 w-full rounded-lg bg-blue-500 hover:bg-blue-400"
          tabIndex={-1}
          aria-hidden="true"
        >
          Start Interview
        </Button>
      </div>
    </FeatureCard>
  )
}

function LiveWorkspaceCard() {
  return (
    <FeatureCard title="Live interview workspace">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <div className="aspect-video w-16 shrink-0 rounded-lg bg-gradient-to-br from-slate-600/80 to-slate-900 ring-1 ring-white/10" />
          <div className="flex flex-1 flex-col gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
            <div className="flex items-center gap-1.5">
              <VoiceRing size={28} />
              <div>
                <p className="text-[10px] font-semibold text-white">Ava</p>
                <p className="text-[9px] text-blue-400">Listening…</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs font-medium leading-snug text-slate-200">
          {SHOWCASE_QUESTION}
        </p>
        <div className="mt-auto grid grid-cols-3 gap-1.5 text-center">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-1.5">
            <p className="text-[9px] text-slate-500">Confidence</p>
            <p className="text-sm font-bold text-emerald-400">72</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-1.5">
            <p className="text-[9px] text-slate-500">Clarity</p>
            <p className="text-sm font-bold text-amber-400">68</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-1.5">
            <p className="text-[9px] text-slate-500">Progress</p>
            <p className="text-sm font-bold text-white">50%</p>
          </div>
        </div>
        <Progress value={50} className="h-1 bg-white/[0.06] [&>div]:bg-blue-500" />
      </div>
    </FeatureCard>
  )
}

function FeedbackCard() {
  return (
    <FeatureCard title="Your detailed feedback">
      <div className="flex flex-1 flex-col items-center gap-3 text-center">
        <p className="text-xs text-slate-500">Overall Score</p>
        <ScoreGauge score={69} label="Good" size="lg" />
        <p className="text-xs leading-relaxed text-slate-500">
          Solid technical foundation with room to improve answer structure and
          depth on follow-ups.
        </p>
        <Link
          href="#feedback"
          className="text-xs font-medium text-blue-400 hover:underline"
        >
          View full report →
        </Link>
      </div>
    </FeatureCard>
  )
}

function ScoreBreakdownCard() {
  return (
    <FeatureCard title="Score breakdown">
      <div className="flex flex-1 flex-col justify-center gap-3">
        {METRICS.map((m) => (
          <MetricBar
            key={m.label}
            label={m.label}
            score={m.score}
            status={m.status}
            compact
          />
        ))}
      </div>
    </FeatureCard>
  )
}

function StrengthsCard() {
  return (
    <FeatureCard title="Strengths & improvement areas">
      <div className="grid flex-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-emerald-400">Strengths</p>
          <ul className="space-y-1.5">
            {STRENGTHS.slice(0, 3).map((s) => (
              <li
                key={s}
                className="flex items-start gap-1.5 text-xs text-slate-500"
              >
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-amber-400">Improve</p>
          <ul className="space-y-1.5">
            {IMPROVEMENTS.map((s) => (
              <li
                key={s}
                className="flex items-start gap-1.5 text-xs text-slate-500"
              >
                <span className="mt-0.5 text-amber-400">×</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FeatureCard>
  )
}

export function ProductShowcase() {
  return (
    <section id="product" className={LANDING_SECTION}>
      <div className={cn(LANDING_CONTAINER, "flex flex-col gap-12 lg:gap-16")}>
        <FadeUp>
          <SectionHeading
            eyebrow="The MockAI Experience"
            title="Everything you need to practice and improve"
          />
        </FadeUp>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StaggerItem>
            <SetupCard />
          </StaggerItem>
          <StaggerItem>
            <LiveWorkspaceCard />
          </StaggerItem>
          <StaggerItem>
            <FeedbackCard />
          </StaggerItem>
          <StaggerItem>
            <ScoreBreakdownCard />
          </StaggerItem>
          <StaggerItem>
            <StrengthsCard />
          </StaggerItem>
          <StaggerItem>
            <ProgressChartCard />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
