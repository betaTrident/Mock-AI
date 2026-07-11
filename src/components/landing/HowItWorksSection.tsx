import { Fragment } from "react"

import { cn } from "@/lib/utils"

import { HOW_IT_WORKS_STEPS } from "./landing-data"
import {
  LANDING_CARD,
  LANDING_CARD_INNER,
  LANDING_CONTAINER,
  LANDING_SECTION,
} from "./landing-styles"
import { FadeUp } from "./motion"
import { SectionHeading } from "./SectionHeading"
import { VoiceRing, VoiceVisualizer } from "./VoiceVisualizer"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className={LANDING_SECTION}>
      <div className={cn(LANDING_CONTAINER, "flex flex-col gap-14 lg:gap-16")}>
        <FadeUp>
          <SectionHeading
            eyebrow="How it Works"
            title="Three simple steps to better interviews"
            description="A focused process that helps you practice smarter and improve faster."
          />
        </FadeUp>

        <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-3">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <Fragment key={step.step}>
              <FadeUp className="h-full">
                <article className={cn(LANDING_CARD, "flex h-full flex-col gap-4 p-5 sm:p-6")}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-400 ring-1 ring-blue-500/25">
                      {step.step}
                    </span>
                    <h3 className="text-base font-semibold text-white sm:text-lg">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>

                  {"fields" in step && step.fields && (
                    <div
                      className={cn(
                        LANDING_CARD_INNER,
                        "mt-auto space-y-2.5 p-3"
                      )}
                    >
                      {step.fields.map((field) => (
                        <div key={field.label}>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            {field.label}
                          </span>
                          <div className="mt-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-200">
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {"listening" in step && step.listening && (
                    <div
                      className={cn(
                        LANDING_CARD_INNER,
                        "mt-auto flex flex-col items-center gap-3 p-5"
                      )}
                    >
                      <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/25 to-violet-500/15 text-base font-bold text-blue-300 ring-2 ring-blue-500/25">
                        A
                      </div>
                      <VoiceRing size={60} />
                      <VoiceVisualizer className="h-5" bars={10} />
                      <span className="text-xs font-medium text-blue-400">
                        Listening…
                      </span>
                    </div>
                  )}

                  {"scores" in step && step.scores && (
                    <div className="mt-auto flex flex-wrap justify-center gap-2">
                      {step.scores.map((s, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex size-11 items-center justify-center rounded-xl border font-bold tabular-nums",
                            s.status === "good"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          )}
                        >
                          {s.value}
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              </FadeUp>
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div
                  className="hidden items-center justify-center lg:flex"
                  aria-hidden="true"
                >
                  <div className="h-px w-8 border-t border-dashed border-slate-600" />
                  <span className="px-1 text-slate-600">→</span>
                  <div className="h-px w-8 border-t border-dashed border-slate-600" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
