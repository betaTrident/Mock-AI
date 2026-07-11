"use client"

import { motion, useReducedMotion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { HERO_QUESTION, HERO_TRANSCRIPT } from "./landing-data"
import { LANDING_CARD, LANDING_CARD_INNER } from "./landing-styles"
import { VoiceRing, VoiceVisualizer } from "./VoiceVisualizer"

function CandidateAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-slate-600/80 to-slate-900 ring-1 ring-white/10",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(59,130,246,0.2),transparent_65%)]" />
      <div className="absolute bottom-0 left-1/2 h-[62%] w-[72%] -translate-x-1/2 rounded-t-[50%] bg-gradient-to-t from-slate-500/90 to-slate-400/50" />
      <div className="absolute left-1/2 top-[22%] size-6 -translate-x-1/2 rounded-full bg-slate-300/80 shadow-inner" />
      <div className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white/80">
        You
      </div>
    </div>
  )
}

function LiveDot() {
  const reduced = useReducedMotion()
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
      {reduced ? (
        <span className="size-1.5 rounded-full bg-emerald-400" />
      ) : (
        <motion.span
          className="size-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      Live
    </span>
  )
}

function CircularMetric({
  label,
  score,
  status,
}: {
  label: string
  score: number
  status: "good" | "needs-work"
}) {
  const color = status === "good" ? "#34d399" : "#fbbf24"
  const statusText = status === "good" ? "Good" : "Needs work"
  const r = 22
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative size-14">
        <svg className="-rotate-90" width="56" height="56" aria-hidden="true">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold tabular-nums text-white">{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500">{label}</span>
      <span
        className={cn(
          "text-[9px] font-medium",
          status === "good" ? "text-emerald-400" : "text-amber-400"
        )}
      >
        {statusText}
      </span>
    </div>
  )
}

type InterviewWorkspaceProps = {
  className?: string
  compact?: boolean
}

export function InterviewWorkspace({
  className,
  compact = false,
}: InterviewWorkspaceProps) {
  return (
    <div
      className={cn(
        LANDING_CARD,
        "relative overflow-hidden ring-1 ring-blue-500/15",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-blue-500/15 blur-3xl" />

      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <div className="min-w-0 flex-1 truncate text-xs font-medium text-slate-200 sm:text-sm">
          Frontend Engineer · Technical Interview
        </div>
        <span className="hidden font-mono text-xs tabular-nums text-slate-500 sm:inline">
          09:42
        </span>
        <LiveDot />
        <Button
          variant="destructive"
          size="xs"
          className="shrink-0 rounded-md border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
          tabIndex={-1}
          aria-hidden="true"
        >
          End Interview
        </Button>
      </div>

      {/* Main workspace */}
      <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[148px_minmax(0,1fr)_130px]">
        {/* Left column */}
        <div className="flex flex-row gap-2 lg:flex-col lg:gap-3">
          <CandidateAvatar className="w-24 shrink-0 sm:w-28 lg:w-full" />
          <div className={cn(LANDING_CARD_INNER, "flex flex-1 flex-col items-center gap-2 p-3")}>
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/20 text-sm font-bold text-blue-300 ring-2 ring-blue-500/30">
              A
            </div>
            <VoiceRing size={52} />
            <div className="text-center">
              <p className="text-xs font-semibold text-white">Ava</p>
              <p className="text-[10px] text-slate-500">Senior Staff Engineer</p>
              <p className="mt-0.5 text-[10px] font-medium text-blue-400">Listening…</p>
            </div>
            {!compact && <VoiceVisualizer size="sm" className="h-3.5" bars={8} />}
          </div>
        </div>

        {/* Center — question */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/5 text-[10px] text-slate-300"
            >
              Question 3 of 8
            </Badge>
            <Badge className="bg-blue-500/15 text-[10px] text-blue-300 hover:bg-blue-500/15">
              Technical · React
            </Badge>
            <Badge className="bg-emerald-500/10 text-[10px] text-emerald-400 hover:bg-emerald-500/10">
              Follow-up ready
            </Badge>
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-100 sm:text-[15px]">
            {HERO_QUESTION}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["Think out loud", "Be specific", "Share examples"].map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-500"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-auto space-y-3 border-t border-white/[0.06] pt-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Interview Progress</span>
                <span>37%</span>
              </div>
              <Progress value={37} className="h-1.5 bg-white/[0.06] [&>div]:bg-blue-500" />
            </div>
            <div className="flex justify-center gap-6 sm:justify-start">
              <CircularMetric label="Confidence" score={72} status="good" />
              <CircularMetric label="Clarity" score={68} status="needs-work" />
            </div>
          </div>
        </div>

        {/* Right — transcript */}
        {!compact && (
          <div
            className={cn(
              LANDING_CARD_INNER,
              "hidden flex-col gap-2 p-2.5 lg:flex"
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Transcript
            </p>
            <div className="flex max-h-[220px] flex-col gap-2.5 overflow-hidden text-[10px] leading-relaxed">
              {HERO_TRANSCRIPT.map((entry, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg px-2 py-1.5",
                    entry.speaker === "Ava"
                      ? "bg-blue-500/10"
                      : "bg-white/[0.04]"
                  )}
                >
                  <span
                    className={cn(
                      "font-semibold",
                      entry.speaker === "Ava" ? "text-blue-400" : "text-slate-300"
                    )}
                  >
                    {entry.speaker}
                  </span>
                  <p className="mt-0.5 text-slate-500">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
