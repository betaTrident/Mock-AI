import { cn } from "@/lib/utils"

import { TRUST_ITEMS } from "./landing-data"
import { LANDING_CARD, LANDING_CONTAINER } from "./landing-styles"
import { FadeUp } from "./motion"

export function TrustStrip() {
  return (
    <section className="pb-16 md:pb-20 lg:pb-24">
      <div className={LANDING_CONTAINER}>
        <FadeUp>
          <div className={cn(LANDING_CARD, "grid gap-8 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:p-8")}>
            {TRUST_ITEMS.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "flex gap-4 lg:px-6",
                  index < TRUST_ITEMS.length - 1 &&
                    "lg:border-r lg:border-white/[0.06]"
                )}
              >
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl border",
                    item.border,
                    item.bg
                  )}
                >
                  <item.icon className={cn("size-5", item.accent)} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
