import Link from "next/link"
import { ArrowRightIcon, CirclePlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  LANDING_BTN_PRIMARY,
  LANDING_BTN_SECONDARY,
  LANDING_CONTAINER,
} from "./landing-styles"
import { FadeUp } from "./motion"

export function FinalCTA() {
  return (
    <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_100%,rgba(59,130,246,0.18),transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -12deg,
            transparent,
            transparent 48px,
            rgba(255,255,255,0.03) 48px,
            rgba(255,255,255,0.03) 49px
          )`,
        }}
      />

      <div className={cn(LANDING_CONTAINER, "relative")}>
        <FadeUp className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
            Walk into your next interview with a plan.
          </h2>
          <p className="text-base text-slate-400 sm:text-lg">
            Practice out loud. Get clear feedback. Improve faster.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
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
        </FadeUp>
      </div>
    </section>
  )
}
