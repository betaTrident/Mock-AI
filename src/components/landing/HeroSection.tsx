"use client"

import Link from "next/link"
import { ArrowRightIcon, CirclePlayIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { HERO_BENEFITS } from "./landing-data"
import {
  LANDING_BTN_PRIMARY,
  LANDING_BTN_SECONDARY,
  LANDING_CONTAINER,
  LANDING_GRADIENT_TEXT,
  LANDING_MOCKUP_GLOW,
} from "./landing-styles"
import { InterviewWorkspace } from "./InterviewWorkspace"
import { MobileInterviewMockup } from "./MobileInterviewMockup"
import { useLandingMotion } from "./motion"

export function HeroSection() {
  const { reduced, fadeIn } = useLandingMotion()

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_70%_0%,rgba(59,130,246,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,rgba(6,182,212,0.06),transparent)]" />

      <div className={cn(LANDING_CONTAINER, "relative")}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-10 xl:gap-14">
          <motion.div
            className="flex flex-col gap-7 lg:gap-8"
            {...(reduced ? {} : fadeIn)}
          >
            <h1 className="text-[2.5rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Practice interviews that feel real — and{" "}
              <span className={LANDING_GRADIENT_TEXT}>improve</span> before the
              real one.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-slate-400 sm:text-[1.05rem]">
              Join realistic mock interviews, speak your answers out loud,
              receive adaptive AI follow-up questions, and get structured coaching
              that helps you improve after every session.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className={LANDING_BTN_PRIMARY}>
                <Link href="/register">
                  Start Practicing
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className={LANDING_BTN_SECONDARY}>
                <a href="#how-it-works" className="gap-2">
                  <CirclePlayIcon className="size-4 text-slate-400" />
                  See how it works
                </a>
              </Button>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
              {HERO_BENEFITS.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 ring-1 ring-blue-500/20">
                    <item.icon className="size-3.5 text-blue-400" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={cn("relative mx-auto w-full lg:mx-0", LANDING_MOCKUP_GLOW)}
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, y: 28 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    duration: 0.75,
                    delay: 0.12,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                })}
          >
            <InterviewWorkspace />
            <MobileInterviewMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
