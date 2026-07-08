import type { FeedbackReportData } from "@/components/interview/FeedbackReport"
import type { InterviewCardData } from "@/components/interview/InterviewCard"
import type { InterviewWorkspaceData } from "@/components/interview/InterviewWorkspace"

export const PLACEHOLDER_USER = {
  name: "Alex Chen",
  email: "alex@example.com",
} as const

export const PLACEHOLDER_INTERVIEWS: InterviewCardData[] = [
  {
    id: "int-001",
    role: "Senior Frontend Engineer",
    difficulty: "senior",
    status: "ACTIVE",
    techStack: ["React", "TypeScript", "Next.js", "CSS"],
    progressPercent: 45,
    lastAttemptScore: 72,
  },
  {
    id: "int-002",
    role: "Backend Engineer",
    difficulty: "mid",
    status: "DRAFT",
    techStack: ["Node.js", "PostgreSQL", "Redis"],
    progressPercent: 0,
  },
  {
    id: "int-003",
    role: "Staff Platform Engineer",
    difficulty: "staff",
    status: "ARCHIVED",
    techStack: ["Kubernetes", "Go", "Terraform"],
    progressPercent: 100,
    lastAttemptScore: 85,
  },
]

export const PLACEHOLDER_WORKSPACE: InterviewWorkspaceData = {
  question:
    "Walk me through how you would design a real-time interview coaching system with multiple AI agents.",
  questionIndex: 2,
  totalQuestions: 8,
  questionType: "technical",
  activeAgent: "question",
  elapsedSeconds: 754,
  progressPercent: 37,
  transcript: [
    {
      id: "t1",
      role: "interviewer",
      content: "Welcome to your mock interview. Let's start with your background.",
      agentName: "question",
    },
    {
      id: "t2",
      role: "candidate",
      content: "I've been building full-stack apps for six years, mostly with React and Node.",
    },
    {
      id: "t3",
      role: "interviewer",
      content: "Great. Now, walk me through your system design approach for this scenario.",
      agentName: "followup",
    },
  ],
}

export const PLACEHOLDER_FEEDBACK: FeedbackReportData = {
  overallScore: 34,
  maxScore: 50,
  percentageScore: 68,
  perQuestionScores: [
    {
      questionIndex: 0,
      questionText: "Tell me about a challenging project you led.",
      score: 7,
      maxScore: 10,
      feedback: "Strong structure and clear outcomes. Could add more metrics.",
    },
    {
      questionIndex: 1,
      questionText: "How do you handle conflicting priorities?",
      score: 6,
      maxScore: 10,
      feedback: "Good stakeholder framing. Missing a concrete example.",
    },
    {
      questionIndex: 2,
      questionText: "Design a scalable API rate limiter.",
      score: 8,
      maxScore: 10,
      feedback: "Solid trade-off analysis and clear component boundaries.",
    },
  ],
  strengths: [
    "Clear communication and structured answers",
    "Strong technical depth on system design",
    "Good use of trade-off framing",
  ],
  areasForImprovement: [
    "Include more quantified impact in behavioral answers",
    "Pause before answering to organize thoughts",
    "Ask clarifying questions earlier in technical prompts",
  ],
  practicePlan: {
    summary:
      "Focus on behavioral storytelling with metrics and timed system design drills over the next four weeks.",
    focusAreas: ["Behavioral (STAR)", "System Design", "Clarifying Questions"],
    estimatedImprovementWeeks: 4,
    weeklyGoals: [
      {
        week: 1,
        goal: "STAR method drills",
        tasks: ["Record 5 behavioral answers", "Add metrics to each story"],
      },
      {
        week: 2,
        goal: "System design practice",
        tasks: ["2 timed design sessions", "Review rate limiting patterns"],
      },
    ],
    resources: [
      {
        title: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
        type: "article",
        focusArea: "System Design",
      },
    ],
  },
}

export const PLACEHOLDER_STATS = {
  totalAttempts: 12,
  avgScore: 71,
  streak: 3,
} as const
