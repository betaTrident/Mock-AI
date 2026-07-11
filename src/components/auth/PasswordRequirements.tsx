import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type PasswordRequirementsProps = {
  password: string
}

const requirements = [
  { id: "length", label: "8+ characters", test: (value: string) => value.length >= 8 },
  { id: "number", label: "One number", test: (value: string) => /\d/.test(value) },
  { id: "symbol", label: "One symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {requirements.map((req) => {
        const met = req.test(password)
        return (
          <li
            key={req.id}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              met ? "text-emerald-400" : "text-slate-500"
            )}
          >
            <CheckIcon className={cn("size-3.5", !met && "opacity-30")} />
            {req.label}
          </li>
        )
      })}
    </ul>
  )
}

export function isPasswordValid(password: string) {
  return requirements.every((req) => req.test(password))
}
