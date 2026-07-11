"use client"

import { FirebaseError } from "firebase/app"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { establishSession, signInWithGoogle } from "@/features/auth"
import { cn } from "@/lib/utils"

import { AUTH_SOCIAL_BTN } from "./auth-styles"

type GoogleAuthButtonProps = {
  mode: "login" | "register"
  className?: string
}

function GoogleIcon() {
  return (
    <img
      src="/assets/google.svg"
      alt=""
      width={16}
      height={16}
      className="size-4 shrink-0"
      aria-hidden="true"
    />
  )
}

function getGoogleAuthErrorMessage(error: unknown): string | null {
  if (!(error instanceof FirebaseError)) {
    return "Could not sign in with Google. Please try again."
  }

  switch (error.code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return null
    case "auth/unauthorized-domain":
      return "This domain is not authorized for Google sign-in. Add it in Firebase Console → Authentication → Settings → Authorized domains."
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email. Sign in with email and password instead."
    case "auth/popup-blocked":
      return "Google sign-in was blocked by your browser. Allow popups for this site and try again."
    default:
      return "Could not sign in with Google. Please try again."
  }
}

export function GoogleAuthButton({ mode, className }: GoogleAuthButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const label = mode === "login" ? "Sign in with Google" : "Sign up with Google"

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const credential = await signInWithGoogle()
      const idToken = await credential.user.getIdToken()
      const ok = await establishSession(idToken)
      if (!ok) {
        toast.error("Failed to establish session")
        return
      }
      router.push("/dashboard")
    } catch (error) {
      const message = getGoogleAuthErrorMessage(error)
      if (message) {
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      className={cn(AUTH_SOCIAL_BTN, "w-full", className)}
      onClick={handleClick}
    >
      <GoogleIcon />
      {isLoading ? "Connecting…" : label}
    </Button>
  )
}

/** @deprecated Use GoogleAuthButton */
export const SocialAuthButtons = GoogleAuthButton

type AuthDividerProps = {
  label?: string
}

export function AuthDivider({ label = "or" }: AuthDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-[#0f172a] px-3 text-[11px] font-medium tracking-wide text-slate-500">
          {label}
        </span>
      </div>
    </div>
  )
}
