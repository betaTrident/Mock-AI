import { cn } from "@/lib/utils"

import { AGENTS } from "./landing-data"
import { LANDING_CARD, LANDING_CONTAINER, LANDING_SECTION } from "./landing-styles"
import { FadeUp } from "./motion"
import { SectionHeading } from "./SectionHeading"

export function AgentCoachSection() {
  return (
    <section id="coaching" className={LANDING_SECTION}>
      <div className={cn(LANDING_CONTAINER, "flex flex-col gap-14 lg:gap-16")}>
        <FadeUp>
          <SectionHeading
            eyebrow="Our Coaching System"
            title="Five AI coaches. One complete interview coaching system."
            description="Each coach has a focused role. Together, they help you improve faster."
          />
        </FadeUp>

        <div className="hidden items-stretch lg:flex">
          {AGENTS.map((agent, index) => (
            <div key={agent.name} className="flex flex-1 items-stretch">
              <FadeUp className="flex-1">
                <article
                  className={cn(
                    LANDING_CARD,
                    "flex h-full flex-col gap-3 p-5"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl border",
                      agent.accent
                    )}
                  >
                    <agent.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {agent.description}
                  </p>
                </article>
              </FadeUp>
              {index < AGENTS.length - 1 && (
                <div
                  className="flex w-6 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="h-px w-full border-t border-dashed border-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {AGENTS.map((agent) => (
            <FadeUp key={agent.name}>
              <article className={cn(LANDING_CARD, "flex h-full flex-col gap-3 p-5")}>
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl border",
                    agent.accent
                  )}
                >
                  <agent.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  {agent.description}
                </p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
