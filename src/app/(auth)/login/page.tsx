'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MailIcon } from 'lucide-react'
import { toast } from 'sonner'

import {
  AuthDivider,
  AuthFormCard,
  AuthShell,
  AUTH_INPUT,
  AUTH_PRIMARY_BTN,
  PasswordField,
  SocialAuthButtons,
} from '@/components/auth'
import { establishSession, signIn } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const REMEMBER_EMAIL_KEY = 'mockai.rememberedEmail'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY)
    if (remembered) {
      setEmail(remembered)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const credential = await signIn(email, password)
      const idToken = await credential.user.getIdToken()
      const ok = await establishSession(idToken)
      if (!ok) {
        setError('Failed to establish session')
        return
      }

      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email)
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }

      router.push('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell variant="login">
      <AuthFormCard title="Welcome back" description="Log in to continue your interview practice.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            error={error ?? undefined}
            hint={
              <button
                type="button"
                className="text-xs text-blue-400 hover:text-blue-300"
                onClick={() =>
                  toast.info('Password reset is not configured yet. Contact support if you are locked out.')
                }
              >
                Forgot password?
              </button>
            }
          />

          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border-white/20 bg-[#0f172a] accent-blue-500"
            />
            Remember me
          </label>

          <Button
            type="submit"
            disabled={isLoading}
            className={AUTH_PRIMARY_BTN}
          >
            {isLoading ? 'Signing in…' : 'Log in'}
          </Button>
        </form>

        <AuthDivider />
        <SocialAuthButtons mode="login" />

        <p className="mt-6 border-t border-white/[0.06] pt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </AuthFormCard>
    </AuthShell>
  )
}
