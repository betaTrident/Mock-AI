import Link from "next/link"
import { PencilIcon } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Profile"
        description="Your account overview and membership details."
        actions={
          <Button variant="outline" size="sm" disabled>
            <PencilIcon data-icon="inline-start" />
            Edit Profile
          </Button>
        }
      />

      <div className="product-panel">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarFallback className="text-lg">KL</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">Account Member</h2>
              <StatusBadge tone="info">Pro Plan</StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">Signed in via MockAI</p>
            <p className="text-xs text-muted-foreground">
              Full profile editing arrives in the settings phase.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/settings">Account settings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
