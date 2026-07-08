import Link from "next/link"
import {
  BarChart3Icon,
  MicIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const features = [
  {
    icon: MicIcon,
    title: "Live voice simulation",
    description: "Practice with real-time speech, webcam, and AI interviewer feedback.",
  },
  {
    icon: SparklesIcon,
    title: "Multi-agent coaching",
    description: "Specialized agents plan, question, evaluate, and coach your performance.",
  },
  {
    icon: BarChart3Icon,
    title: "Structured feedback",
    description: "Per-question scores, strengths analysis, and a personalized practice plan.",
  },
] as const

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <Badge variant="secondary" className="text-xs uppercase tracking-wider">
          Interview coaching studio
        </Badge>
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Practice interviews that feel real — and improve fast.
          </h1>
          <p className="text-lg text-muted-foreground">
            MockAI runs a full voice and video simulation with specialized AI agents that
            question, follow up, evaluate, and coach you through every answer.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/interview/new">Start Interview</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border bg-card/50 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60 bg-background/60">
              <CardHeader>
                <feature.icon className="text-primary" />
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-border px-6 py-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MockAI</p>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Built with Gemini 2.5 Flash</Badge>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
