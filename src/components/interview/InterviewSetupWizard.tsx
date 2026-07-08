"use client"

import { useState } from "react"
import { z } from "zod"

import { createInterviewSchema } from "@/lib/validations/interview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const stepSchemas = {
  role: createInterviewSchema.pick({ role: true, description: true }),
  level: createInterviewSchema.pick({ experience: true, difficulty: true }),
  tech: createInterviewSchema.pick({ techStack: true }),
} as const

type WizardTab = "role" | "level" | "tech" | "review"

export type InterviewSetupData = z.infer<typeof createInterviewSchema>

type InterviewSetupWizardProps = {
  onSubmit: (data: InterviewSetupData) => void | Promise<void>
  isSubmitting?: boolean
}

const defaultForm: InterviewSetupData = {
  role: "",
  description: "",
  experience: 3,
  difficulty: "mid",
  techStack: [],
}

export function InterviewSetupWizard({
  onSubmit,
  isSubmitting = false,
}: InterviewSetupWizardProps) {
  const [tab, setTab] = useState<WizardTab>("role")
  const [form, setForm] = useState<InterviewSetupData>(defaultForm)
  const [techInput, setTechInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: WizardTab) => {
    if (step === "review") return true

    const schema = stepSchemas[step]
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
    const order: WizardTab[] = ["role", "level", "tech", "review"]
    const index = order.indexOf(tab)
    if (!validateStep(tab)) return
    if (index < order.length - 1) setTab(order[index + 1]!)
  }

  const goBack = () => {
    const order: WizardTab[] = ["role", "level", "tech", "review"]
    const index = order.indexOf(tab)
    if (index > 0) setTab(order[index - 1]!)
  }

  const addTech = () => {
    const value = techInput.trim()
    if (!value) return
    setForm((prev) => ({
      ...prev,
      techStack: [...new Set([...prev.techStack, value])],
    }))
    setTechInput("")
  }

  const handleSubmit = async () => {
    const result = createInterviewSchema.safeParse(form)
    if (!result.success) {
      setErrors({ form: "Please complete all required fields." })
      return
    }
    await onSubmit(result.data)
  }

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as WizardTab)}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="role">Role</TabsTrigger>
        <TabsTrigger value="level">Level</TabsTrigger>
        <TabsTrigger value="tech">Tech Stack</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
      </TabsList>

      <TabsContent value="role" className="mt-4">
        <FieldGroup>
          <Field data-invalid={!!errors.role}>
            <FieldLabel htmlFor="role">Job title</FieldLabel>
            <Input
              id="role"
              value={form.role}
              aria-invalid={!!errors.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="e.g. Senior Frontend Engineer"
            />
            <FieldError>{errors.role}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Role description</FieldLabel>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief context about the role and team..."
              rows={4}
            />
            <FieldDescription>Optional but helps tailor questions.</FieldDescription>
          </Field>
        </FieldGroup>
      </TabsContent>

      <TabsContent value="level" className="mt-4">
        <FieldGroup>
          <Field data-invalid={!!errors.experience}>
            <FieldLabel htmlFor="experience">Years of experience</FieldLabel>
            <Input
              id="experience"
              type="number"
              min={0}
              value={form.experience}
              aria-invalid={!!errors.experience}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, experience: Number(e.target.value) }))
              }
            />
            <FieldError>{errors.experience}</FieldError>
          </Field>
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
              <SelectTrigger aria-invalid={!!errors.difficulty}>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid-level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError>{errors.difficulty}</FieldError>
          </Field>
        </FieldGroup>
      </TabsContent>

      <TabsContent value="tech" className="mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="tech">Technologies</FieldLabel>
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
                placeholder="Type and press Enter"
              />
              <Button type="button" variant="secondary" onClick={addTech}>
                Add
              </Button>
            </div>
            <FieldDescription>Comma-separated tags rendered as badges.</FieldDescription>
          </Field>
          <div className="flex flex-wrap gap-1">
            {form.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </FieldGroup>
      </TabsContent>

      <TabsContent value="review" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Review setup</CardTitle>
            <CardDescription>Confirm details before starting the interview.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p>
              <span className="text-muted-foreground">Role:</span> {form.role || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Experience:</span> {form.experience} years
            </p>
            <p>
              <span className="text-muted-foreground">Difficulty:</span> {form.difficulty}
            </p>
            <div className="flex flex-wrap gap-1">
              {form.techStack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <FieldError className="mt-2">{errors.form}</FieldError>
      </TabsContent>

      <div className="mt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={goBack} disabled={tab === "role"}>
          Back
        </Button>
        {tab === "review" ? (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Start Interview"}
          </Button>
        ) : (
          <Button type="button" onClick={goNext}>
            Next
          </Button>
        )}
      </div>
    </Tabs>
  )
}
