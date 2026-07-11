'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MailIcon, UserIcon } from 'lucide-react'
import { updateProfile } from 'firebase/auth'

import {
  AuthDivider,
  AuthFormCard,
  AuthShell,
  AUTH_INPUT,
  AUTH_PRIMARY_BTN,
  isPasswordValid,
  PasswordField,
  PasswordRequirements,
  SocialAuthButtons,
} from '@/components/auth'
import { establishSession, signUp } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!isPasswordValid(password)) {
      setError('Please meet all password requirements.')
      return
    }

    setIsLoading(true)

    try {
      const credential = await signUp(email, password)
      if (fullName.trim()) {
        await updateProfile(credential.user, { displayName: fullName.trim() })
      }
      const idToken = await credential.user.getIdToken()
      const ok = await establishSession(idToken)
      if (!ok) {
        setError('Failed to establish session')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Could not create account. This email may already be in use.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell variant="register">
      <AuthFormCard
        title="Create your account"
        description="Start your interview improvement journey."
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName" className="text-slate-300">
              Full name
            </Label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={cn(AUTH_INPUT, "pl-10")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-slate-300">
              Email
            </Label>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(AUTH_INPUT, "pl-10")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              placeholder="Create a strong password"
            />
            <PasswordRequirements password={password} />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <Button
            type="submit"
            disabled={isLoading || !isPasswordValid(password)}
            className={AUTH_PRIMARY_BTN}
          >
            {isLoading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <AuthDivider />
        <SocialAuthButtons mode="register" />

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
          By creating an account, you agree to our{' '}
          <Link href="/" className="text-slate-400 underline-offset-2 hover:text-slate-300 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/" className="text-slate-400 underline-offset-2 hover:text-slate-300 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="mt-6 border-t border-white/[0.06] pt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
            Log in
          </Link>
        </p>
      </AuthFormCard>
    </AuthShell>
  )
}
