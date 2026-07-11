import { cn } from "@/lib/utils"

import { PRIVACY_ITEMS } from "./landing-data"
import { LANDING_CONTAINER, LANDING_SECTION } from "./landing-styles"
import { FadeUp, Stagger, StaggerItem } from "./motion"
import { SectionHeading } from "./SectionHeading"

export function PrivacySection() {
  return (
    <section className={LANDING_SECTION}>
      <div className={cn(LANDING_CONTAINER, "flex flex-col gap-14 lg:gap-16")}>
        <FadeUp>
          <SectionHeading
            eyebrow="Your Data. Yours."
            title="Private by design. Always."
          />
        </FadeUp>

        <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRIVACY_ITEMS.map((item) => (
            <StaggerItem key={item.title}>
              <div className="flex flex-col gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                  <item.icon className="size-5 text-blue-400" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
