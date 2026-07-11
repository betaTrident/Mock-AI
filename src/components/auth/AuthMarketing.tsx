import Link from "next/link"
import {
  BarChart3Icon,
  MicIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  type LucideIcon,
} from "lucide-react"

import { Logo } from "@/components/landing/Logo"
import { AUTH_GRADIENT_TEXT, AUTH_MARKETING_WIDTH } from "@/components/auth/auth-styles"
import { cn } from "@/lib/utils"

type AuthMarketingProps = {
  variant: "login" | "register"
  className?: string
}

type FeatureItem = {
  title: string
  body: string
  icon: LucideIcon
  iconClassName: string
}

const loginFeatures: FeatureItem[] = [
  {
    title: "Realistic AI Interviews",
    body: "Adaptive follow-ups that mirror real hiring conversations.",
    icon: MicIcon,
    iconClassName: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "Actionable Feedback",
    body: "Scores, strengths, and gaps you can act on immediately.",
    icon: BarChart3Icon,
    iconClassName: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: "Personalized Improvement",
    body: "Weekly practice goals tailored to your weak areas.",
    icon: TargetIcon,
    iconClassName: "bg-violet-500/15 text-violet-400",
  },
]

const registerFeatures: FeatureItem[] = [
  {
    title: "Practice interviews",
    body: "Role-specific sessions with adaptive follow-ups.",
    icon: MicIcon,
    iconClassName: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "Speak out loud",
    body: "Train delivery, not just typing answers in a doc.",
    icon: SparklesIcon,
    iconClassName: "bg-cyan-500/15 text-cyan-400",
  },
  {
    title: "Improve faster",
    body: "Structured coaching after every completed session.",
    icon: ShieldCheckIcon,
    iconClassName: "bg-emerald-500/15 text-emerald-400",
  },
]

function FeatureList({ items }: { items: FeatureItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <li key={item.title} className="flex gap-3.5">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl",
                item.iconClassName
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="pt-0.5">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{item.body}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function AuthMarketing({ variant, className }: AuthMarketingProps) {
  const isLogin = variant === "login"

  return (
    <div className={cn(AUTH_MARKETING_WIDTH, "flex flex-col gap-8", className)}>
      <Logo />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl xl:text-[2.75rem]">
          {isLogin ? (
            <>
              Practice with purpose.
              <br />
              Perform with <span className={AUTH_GRADIENT_TEXT}>confidence.</span>
            </>
          ) : (
            <>
              Better practice. Better results.{" "}
              <span className={AUTH_GRADIENT_TEXT}>That&apos;s the plan.</span>
            </>
          )}
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-slate-400 sm:text-[0.95rem]">
          {isLogin
            ? "Realistic AI interviews, structured feedback, and a coaching plan that helps you improve before the real thing."
            : "Join thousands of candidates building interview confidence with AI coaching that adapts to your role and skill level."}
        </p>
      </div>

      <FeatureList items={isLogin ? loginFeatures : registerFeatures} />

      {isLogin ? (
        <figure className="rounded-2xl border border-white/[0.08] bg-[#0f172a]/60 p-5">
          <blockquote className="text-sm leading-relaxed text-slate-300">
            &ldquo;MockAI helped me structure my answers and spot weak areas before my
            onsite. The feedback felt specific, not generic.&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-300">
              AK
            </span>
            <div>
              <p className="text-sm font-medium text-white">Arjun K.</p>
              <p className="text-xs text-slate-400">Software Engineer</p>
            </div>
            <div className="ml-auto text-sm tracking-widest text-amber-400" aria-label="5 star rating">
              ★★★★★
            </div>
          </figcaption>
        </figure>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0f172a]/60 p-5">
          <p className="text-sm font-medium text-white">Trusted by job seekers</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["JD", "ML", "SC"].map((initials) => (
                <span
                  key={initials}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-[#0b1120] bg-slate-600 text-xs font-medium text-white"
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-400">and growing every day</p>
          </div>
        </div>
      )}

      <AuthMountainArt />
    </div>
  )
}

export function AuthMarketingMobile({ variant }: { variant: "login" | "register" }) {
  const isLogin = variant === "login"

  return (
    <div className="mb-8 space-y-3 lg:hidden">
      <Logo />
      <h2 className="text-2xl font-bold leading-tight text-white">
        {isLogin ? (
          <>
            Welcome back to{" "}
            <span className={AUTH_GRADIENT_TEXT}>MockAI</span>
          </>
        ) : (
          <>
            Start practicing with{" "}
            <span className={AUTH_GRADIENT_TEXT}>purpose</span>
          </>
        )}
      </h2>
      <p className="text-sm text-slate-400">
        {isLogin
          ? "Log in to continue your interview coaching journey."
          : "Create an account to unlock AI mock interviews and feedback."}
      </p>
    </div>
  )
}

function AuthMountainArt() {
  return (
    <div className="relative mt-2 h-24 overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0b1120]/50" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent" />
      <svg
        viewBox="0 0 480 96"
        className="absolute inset-x-0 bottom-0 w-full text-slate-800/90"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0 96 L0 58 L72 42 L144 54 L216 34 L288 48 L360 30 L432 46 L480 36 L480 96 Z"
        />
        <path
          fill="currentColor"
          className="text-slate-700/80"
          d="M0 96 L0 68 L96 56 L192 64 L288 50 L384 60 L480 52 L480 96 Z"
        />
      </svg>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <span className="size-2 rounded-full bg-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
        <span className="h-6 w-px bg-gradient-to-b from-blue-400/80 to-transparent" />
      </div>
    </div>
  )
}

export function AuthLoginTopBar() {
  return (
    <header className="relative z-10 flex w-full items-center justify-between py-5 lg:absolute lg:left-0 lg:right-0 lg:top-0 lg:px-10 xl:px-14 lg:hidden">
      <Logo />
      <p className="text-sm text-slate-400">
        No account?{" "}
        <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
          Sign up
        </Link>
      </p>
    </header>
  )
}
