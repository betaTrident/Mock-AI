import { redirect } from "next/navigation"

import { AppLayoutClient } from "@/components/shared/AppLayoutClient"
import { requireServerAuth } from "@/lib/auth-server"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireServerAuth().catch(() => null)
  if (!user) {
    redirect("/login")
  }

  return (
    <AppLayoutClient
      user={{
        name: user.name ?? "User",
        email: user.email ?? "",
      }}
    >
      {children}
    </AppLayoutClient>
  )
}
