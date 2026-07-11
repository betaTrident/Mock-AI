import {
  AuthLoginTopBar,
  AuthMarketing,
  AuthMarketingMobile,
} from "@/components/auth/AuthMarketing"
import { AUTH_CONTENT_WIDTH } from "@/components/auth/auth-styles"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  variant: "login" | "register"
  children: React.ReactNode
}

export function AuthShell({ variant, children }: AuthShellProps) {
  const isRegister = variant === "register"

  return (
    <div className="landing-page relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_20%,rgba(59,130,246,0.14),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_85%_75%,rgba(6,182,212,0.07),transparent)]" />

      {!isRegister ? <AuthLoginTopBar /> : null}

      <main className="relative z-10 flex flex-1 flex-col lg:min-h-0">
        <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-12 xl:max-w-7xl xl:gap-20 xl:px-14">
          <section
            className="hidden lg:flex lg:items-center lg:justify-center"
            aria-label="Product overview"
          >
            <div className="relative w-full">
              <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-blue-500/[0.03] blur-2xl" />
              <AuthMarketing variant={variant} className="relative" />
            </div>
          </section>

          {/* Form column — centered in its half */}
          <section className="flex w-full items-center justify-center lg:justify-center">
            <div className={cn(AUTH_CONTENT_WIDTH, "w-full")}>
              <AuthMarketingMobile variant={variant} />
              {children}
            </div>
          </section>
        </div>
      </main>

      <AuthSecurityFooter />
    </div>
  )
}

function AuthSecurityFooter() {
  return (
    <footer className="relative z-10 flex items-center justify-center gap-2 border-t border-white/[0.06] px-6 py-4 text-center text-xs text-slate-500">
      <span className="inline-block size-1.5 rounded-full bg-emerald-500/80" aria-hidden="true" />
      Your data is private and secure. We never share your interviews or feedback.
    </footer>
  )
}
