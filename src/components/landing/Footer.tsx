import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import {
  FOOTER_COMPANY,
  FOOTER_LEGAL,
  FOOTER_PRODUCT,
} from "./landing-data"
import { LANDING_BTN_PRIMARY, LANDING_CARD, LANDING_CONTAINER } from "./landing-styles"
import { Logo } from "./Logo"

const SOCIAL = [
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
] as const

function FooterLinkGroup({
  title,
  links,
}: {
  title: string
  links: readonly { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-slate-500 transition-colors hover:text-slate-300"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#020617] pt-16 pb-8">
      <div className={cn(LANDING_CONTAINER)}>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_280px]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-slate-500">
              Built for serious practice.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-500 transition-colors hover:border-white/15 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterLinkGroup title="Product" links={FOOTER_PRODUCT} />
          <FooterLinkGroup title="Company" links={FOOTER_COMPANY} />
          <FooterLinkGroup title="Legal" links={FOOTER_LEGAL} />

          <div className={cn(LANDING_CARD, "flex flex-col gap-3 p-5")}>
            <h3 className="text-sm font-semibold text-white">Ready to improve?</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Join job seekers practicing with MockAI.
            </p>
            <Button asChild size="sm" className={cn(LANDING_BTN_PRIMARY, "h-9 w-full text-sm")}>
              <Link href="/register">
                Start Practicing
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-white/[0.06]" />

        <p className="text-center text-sm text-slate-600">
          © {new Date().getFullYear()} MockAI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
