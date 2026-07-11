"use client"

import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { HERO_QUESTION } from "./landing-data"
import { useLandingMotion } from "./motion"
import { VoiceRing } from "./VoiceVisualizer"

export function MobileInterviewMockup({ className }: { className?: string }) {
  const { float, reduced } = useLandingMotion()

  const content = (
    <div
      className={cn(
        "w-[156px] overflow-hidden rounded-[2rem] border-[3px] border-slate-700/80 bg-[#0f172a] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10 sm:w-[172px]",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-center bg-[#020617] py-1.5">
        <div className="h-1 w-12 rounded-full bg-slate-700" />
      </div>
      <div className="space-y-2.5 p-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-medium text-emerald-400">
            ● Live
          </span>
          <span className="font-mono text-[9px] text-slate-500">09:42</span>
        </div>
        <p className="text-[9px] font-semibold text-white">Interview in progress</p>
        <p className="line-clamp-4 text-[8px] leading-snug text-slate-500">
          {HERO_QUESTION}
        </p>
        <div className="flex justify-center py-0.5">
          <VoiceRing size={40} />
        </div>
        <Progress value={37} className="h-1 bg-white/[0.06] [&>div]:bg-blue-500" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-1.5 text-center">
            <p className="text-[7px] text-slate-500">Confidence</p>
            <p className="text-xs font-bold text-emerald-400">72</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-1.5 text-center">
            <p className="text-[7px] text-slate-500">Clarity</p>
            <p className="text-xs font-bold text-amber-400">68</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="xs"
          className="h-6 w-full rounded-md border border-red-500/40 bg-red-500/10 text-[9px] text-red-400"
          tabIndex={-1}
        >
          End
        </Button>
      </div>
    </div>
  )

  if (reduced) {
    return (
      <div className="absolute -right-1 top-6 z-10 sm:-right-4 sm:top-10">{content}</div>
    )
  }

  return (
    <motion.div
      className="absolute -right-1 top-6 z-10 sm:-right-4 sm:top-10"
      {...float}
    >
      {content}
    </motion.div>
  )
}
