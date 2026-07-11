"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  CodeIcon,
  GitBranchIcon,
  MessageSquareIcon,
  PlusIcon,
  SignalIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react"
import { z } from "zod"

import {
  InterviewCoachPreview,
  type InterviewTypeOption,
} from "@/components/interview/InterviewCoachPreview"
import {
  InterviewSetupStepper,
  setupSteps,
  type SetupStep,
} from "@/components/interview/InterviewSetupStepper"
import { createInterviewSchema } from "@/lib/validations/interview"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const stepSchemas = {
  role: createInterviewSchema.pick({ role: true, description: true }),
  details: createInterviewSchema.pick({ experience: true, techStack: true }),
  difficulty: createInterviewSchema.pick({ difficulty: true }),
} as const

const STEP_ORDER: SetupStep[] = ["role", "details", "difficulty", "review"]

export type InterviewSetupData = z.infer<typeof createInterviewSchema>

type InterviewSetupWizardProps = {
  onSubmit: (data: InterviewSetupData) => void | Promise<void>
  isSubmitting?: boolean
}

const defaultForm: InterviewSetupData = {
  role: "Frontend Engineer",
  description:
    "Build and maintain customer-facing web applications. Collaborate with design and backend teams to ship accessible, performant UI.",
  experience: 3,
  difficulty: "mid",
  techStack: ["React", "Next.js", "TypeScript", "CSS", "Testing"],
}

const interviewTypes: {
  id: InterviewTypeOption
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { id: "behavioral", label: "Behavioral", description: "STAR stories & soft skills", icon: MessageSquareIcon },
  { id: "technical", label: "Technical", description: "Coding & problem solving", icon: CodeIcon },
  { id: "system_design", label: "System Design", description: "Architecture & trade-offs", icon: GitBranchIcon },
  { id: "mixed", label: "Mixed", description: "Balanced coaching session", icon: SparklesIcon },
]

const experienceOptions = [
  { value: 1, label: "Junior (0–2 years)" },
  { value: 3, label: "Mid-level (2–5 years)" },
  { value: 6, label: "Senior (5–8 years)" },
  { value: 10, label: "Staff (8+ years)" },
]

export function InterviewSetupWizard({
  onSubmit,
  isSubmitting = false,
}: InterviewSetupWizardProps) {
  const [step, setStep] = useState<SetupStep>("role")
  const [form, setForm] = useState<InterviewSetupData>(defaultForm)
  const [interviewType, setInterviewType] = useState<InterviewTypeOption>("technical")
  const [techInput, setTechInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (current: SetupStep) => {
    if (current === "review") return true
    const schema = stepSchemas[current]
    const result = schema.safeParse(form)
    if (!result.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (typeof key === "string") nextErrors[key] = issue.message
      }
      setErrors(nextErrors)
      return false
    }
    setErrors({})
    return true
  }

  const goNext = () => {
    if (!validateStep(step)) return
    const index = STEP_ORDER.indexOf(step)
    if (index < STEP_ORDER.length - 1) setStep(STEP_ORDER[index + 1]!)
  }

  const goBack = () => {
    const index = STEP_ORDER.indexOf(step)
    if (index > 0) setStep(STEP_ORDER[index - 1]!)
  }

  const addTech = () => {
    const value = techInput.trim()
    if (!value || form.techStack.length >= 20) return
    setForm((prev) => ({
      ...prev,
      techStack: [...new Set([...prev.techStack, value])],
    }))
    setTechInput("")
  }

  const removeTech = (tech: string) => {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((item) => item !== tech),
    }))
  }

  const handleSubmit = async () => {
    const result = createInterviewSchema.safeParse(form)
    if (!result.success) {
      setErrors({ form: "Please complete all required fields." })
      return
    }
    await onSubmit(result.data)
  }

  const canGenerate = createInterviewSchema.safeParse(form).success

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return
      if (!createInterviewSchema.safeParse(form).success || isSubmitting) return
      event.preventDefault()
      void handleSubmit()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [form, isSubmitting])

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="product-panel">
        <div className="product-panel-header gap-4">
          <InterviewSetupStepper currentStep={step} />
        </div>

        <div className="product-panel-body flex flex-col gap-6">
          {step === "role" ? (
            <FieldGroup>
              <Field data-invalid={!!errors.role}>
                <FieldLabel htmlFor="role">Job title</FieldLabel>
                <Input
                  id="role"
                  value={form.role}
                  aria-invalid={!!errors.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                />
                <FieldError>{errors.role}</FieldError>
              </Field>
              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="description">Role description</FieldLabel>
                <Textarea
                  id="description"
                  value={form.description}
                  rows={5}
                  maxLength={600}
                  aria-invalid={!!errors.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <FieldDescription className="text-right">
                  {form.description.length}/600
                </FieldDescription>
                <FieldError>{errors.description}</FieldError>
              </Field>
            </FieldGroup>
          ) : null}

          {step === "details" ? (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tech">Tech stack / skills</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="tech"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTech()
                      }
                    }}
                    placeholder="Add a skill"
                  />
                  <Button type="button" variant="outline" onClick={addTech}>
                    <PlusIcon data-icon="inline-start" />
                    Add skill
                  </Button>
                </div>
                <FieldError>{errors.techStack}</FieldError>
              </Field>
              <div className="flex flex-wrap gap-2">
                {form.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1 pr-1">
                    {tech}
                    <button
                      type="button"
                      className="rounded-full p-0.5 hover:bg-muted"
                      onClick={() => removeTech(tech)}
                      aria-label={`Remove ${tech}`}
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Field data-invalid={!!errors.experience}>
                <FieldLabel>Experience level</FieldLabel>
                <Select
                  value={String(form.experience)}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, experience: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <BriefcaseIcon className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {experienceOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError>{errors.experience}</FieldError>
              </Field>
            </FieldGroup>
          ) : null}

          {step === "difficulty" ? (
            <FieldGroup>
              <Field data-invalid={!!errors.difficulty}>
                <FieldLabel>Difficulty</FieldLabel>
                <Select
                  value={form.difficulty}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      difficulty: value as InterviewSetupData["difficulty"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SignalIcon className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="junior">Easy</SelectItem>
                      <SelectItem value="mid">Medium</SelectItem>
                      <SelectItem value="senior">Hard</SelectItem>
                      <SelectItem value="staff">Expert</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError>{errors.difficulty}</FieldError>
              </Field>

              <div className="flex flex-col gap-2">
                <FieldLabel>Interview type</FieldLabel>
                <p className="text-xs text-muted-foreground">
                  Shapes coaching preview only — generation still uses your role and stack.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {interviewTypes.map((type) => {
                    const Icon = type.icon
                    const selected = interviewType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setInterviewType(type.id)}
                        className={cn(
                          "relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors",
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/20 hover:border-border/80"
                        )}
                      >
                        {selected ? (
                          <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <CheckIcon className="size-3" />
                          </span>
                        ) : null}
                        <Icon className="size-5 text-primary" />
                        <span className="text-sm font-semibold">{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.description}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </FieldGroup>
          ) : null}

          {step === "review" ? (
            <div className="flex flex-col gap-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium">{form.role}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interview type</p>
                  <p className="font-medium capitalize">{interviewType.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">{form.experience} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Difficulty</p>
                  <p className="font-medium capitalize">{form.difficulty}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-muted-foreground">Tech stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.techStack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <FieldError>{errors.form}</FieldError>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={step === "role"}
              >
                Back
              </Button>
              {step === "review" ? (
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Generating..." : "Generate Interview"}
                </Button>
              ) : (
                <Button type="button" onClick={goNext}>
                  Continue to {setupSteps[STEP_ORDER.indexOf(step) + 1]?.label ?? "Review"}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <InterviewCoachPreview
        form={form}
        interviewType={interviewType}
        onGenerate={handleSubmit}
        isSubmitting={isSubmitting}
        canGenerate={canGenerate}
      />
    </div>
  )
}
