import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  BookOpen,
  Brain,
  Code2,
  GraduationCap,
  Lock,
  MessageSquare,
  Mic,
  Pencil,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  Users,
} from "lucide-react"

export const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Feedback", href: "#feedback" },
  { label: "Pricing", href: "#pricing" },
] as const

export const HERO_BENEFITS = [
  { icon: Users, label: "Realistic AI interviewers" },
  { icon: Mic, label: "Speak out loud & get follow-ups" },
  { icon: Sparkles, label: "Detailed coaching" },
  { icon: BarChart3, label: "Track progress & improve" },
] as const

export const TRUST_ITEMS = [
  {
    icon: Target,
    title: "Role-based questions",
    description: "Tailored to your role and seniority.",
    accent: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/10",
  },
  {
    icon: Lock,
    title: "Private practice sessions",
    description: "Your sessions remain private and secure.",
    accent: "text-violet-400",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
  },
  {
    icon: BarChart3,
    title: "Structured scoring",
    description: "Clear rubrics across important interview skills.",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Brain,
    title: "Personalized coaching",
    description: "Actionable feedback that helps you improve.",
    accent: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
] as const

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Choose your role",
    description:
      "Select your target role, interview type, and difficulty to match real hiring expectations.",
    fields: [
      { label: "Target role", value: "Frontend Engineer" },
      { label: "Interview type", value: "Technical Interview" },
      { label: "Difficulty", value: "Medium" },
    ],
  },
  {
    step: 2,
    title: "Practice the interview",
    description:
      "Answer out loud with voice input and receive adaptive follow-up questions from your AI interviewer.",
    listening: true,
  },
  {
    step: 3,
    title: "Review your coaching plan",
    description:
      "Get structured scores across key skills and a personalized plan to improve before your next session.",
    scores: [
      { value: 72, status: "good" as const },
      { value: 68, status: "needs-work" as const },
      { value: 70, status: "good" as const },
      { value: 65, status: "needs-work" as const },
      { value: 74, status: "good" as const },
    ],
  },
] as const

export const METRICS = [
  { label: "Communication", score: 72, status: "good" as const },
  { label: "Technical Depth", score: 68, status: "needs-work" as const },
  { label: "Structure", score: 70, status: "good" as const },
  { label: "Confidence", score: 65, status: "needs-work" as const },
  { label: "Follow-up Readiness", score: 74, status: "good" as const },
] as const

export const STRENGTHS = [
  "Explains concepts clearly",
  "Good use of examples",
  "Logical problem solving",
  "Stays calm under pressure",
] as const

export const IMPROVEMENTS = [
  "Go deeper on trade-offs",
  "Structure answers better",
  "Prepare stronger follow-up answers",
] as const

export const PROGRESS_DATA = [
  { week: "Week 1", score: 54 },
  { week: "Week 2", score: 58 },
  { week: "Week 3", score: 63 },
  { week: "Week 4", score: 66 },
  { week: "This week", score: 69 },
] as const

export const AGENTS = [
  {
    name: "Planner",
    description:
      "Creates a personalized interview plan based on your role, goals, and experience level.",
    icon: Target,
    accent: "text-primary border-primary/40 bg-primary/10",
  },
  {
    name: "Interviewer",
    description:
      "Runs realistic interviews with role-specific questions and adapts to your answers.",
    icon: Mic,
    accent: "text-violet-400 border-violet-500/40 bg-violet-500/10",
  },
  {
    name: "Follow-up Coach",
    description:
      "Asks relevant follow-up questions to test depth and real-world thinking.",
    icon: MessageSquare,
    accent: "text-teal-400 border-teal-500/40 bg-teal-500/10",
  },
  {
    name: "Evaluator",
    description:
      "Scores responses using structured rubrics across key interview skills.",
    icon: BarChart3,
    accent: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  },
  {
    name: "Practice Coach",
    description:
      "Builds an improvement plan and recommends practice for weak areas.",
    icon: Sparkles,
    accent: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  },
] as const

export type UseCaseItem = {
  title: string
  description: string
  icon: LucideIcon
  accent: string
}

export const USE_CASES: UseCaseItem[] = [
  {
    title: "Students",
    description:
      "Build confidence and become interview-ready for a first role.",
    icon: GraduationCap,
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  },
  {
    title: "Career Switchers",
    description:
      "Prepare for a new industry and communicate transferable skills.",
    icon: RefreshCw,
    accent: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  },
  {
    title: "Junior Developers",
    description:
      "Strengthen fundamentals and explain technical thinking clearly.",
    icon: Code2,
    accent: "text-primary bg-primary/10 border-primary/30",
  },
  {
    title: "Senior Engineers",
    description:
      "Practice system design, leadership, architecture, and deep technical interviews.",
    icon: Shield,
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    title: "Behavioral Prep",
    description:
      "Prepare STAR stories, situational answers, and leadership examples.",
    icon: MessageSquare,
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    title: "Technical Prep",
    description:
      "Practice data structures, algorithms, React, system design, and technical concepts.",
    icon: Pencil,
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  },
]

export const PRACTICE_PLAN = [
  {
    title: "Improve answer structure",
    detail: "Practice the PREP framework",
    sessions: 5,
  },
  {
    title: "Deep dive: React performance",
    detail: "Focus on rendering, memoization, and large lists",
    sessions: 3,
  },
  {
    title: "Mock interview practice",
    detail: "Two technical and one behavioral session this week",
    sessions: 3,
  },
] as const

export const PRIVACY_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Your data is protected",
    description: "Practice data is encrypted and stored securely.",
  },
  {
    icon: Server,
    title: "AI calls are server-side",
    description: "AI processing is handled securely on the server.",
  },
  {
    icon: UserCheck,
    title: "Sessions belong to you",
    description: "Sessions and reports remain private to you.",
  },
  {
    icon: BookOpen,
    title: "Review anytime",
    description: "Access feedback history and track improvement.",
  },
] as const

export const FOOTER_PRODUCT = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#product" },
  { label: "Coaching System", href: "#coaching" },
  { label: "Changelog", href: "#" },
] as const

export const FOOTER_COMPANY = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
] as const

export const FOOTER_LEGAL = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Data Processing", href: "#" },
  { label: "Security", href: "#" },
] as const

export const HERO_TRANSCRIPT = [
  {
    speaker: "Ava",
    text: "Can you walk me through your approach to identifying the performance issue?",
  },
  {
    speaker: "You",
    text: "I would begin by profiling the application with React DevTools and checking for unnecessary re-renders.",
  },
  {
    speaker: "Ava",
    text: "How would you handle a page containing a very large list?",
  },
  {
    speaker: "You",
    text: "I would consider virtualization with tools such as react-window and then evaluate memoization and data-fetching behavior.",
  },
] as const

export const HERO_QUESTION =
  "Explain how you would optimize the performance of a React application that is rendering slowly."

export const SHOWCASE_QUESTION =
  "How would you handle state management in a large React application?"
