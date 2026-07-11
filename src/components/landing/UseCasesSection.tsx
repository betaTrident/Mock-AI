import { cn } from "@/lib/utils"

import { USE_CASES } from "./landing-data"
import { LANDING_CARD, LANDING_CONTAINER, LANDING_SECTION } from "./landing-styles"
import { FadeUp, Stagger, StaggerItem } from "./motion"
import { SectionHeading } from "./SectionHeading"

export function UseCasesSection() {
  return (
    <section className={LANDING_SECTION}>
      <div className={cn(LANDING_CONTAINER, "flex flex-col gap-14 lg:gap-16")}>
        <FadeUp>
          <SectionHeading
            eyebrow="Built for Every Career Journey"
            title="Practice that fits your path"
          />
        </FadeUp>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((item) => (
            <StaggerItem key={item.title}>
              <article
                className={cn(
                  LANDING_CARD,
                  "flex h-full flex-col gap-3 p-5 transition-colors hover:border-white/12"
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl border",
                    item.accent
                  )}
                >
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
