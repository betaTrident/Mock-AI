import { cn } from "@/lib/utils"

import {
  LANDING_EYEBROW,
  LANDING_SECTION_TITLE,
} from "./landing-styles"

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className={LANDING_EYEBROW}>{eyebrow}</p>
      <h2 className={LANDING_SECTION_TITLE}>{title}</h2>
      {description ? (
        <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
