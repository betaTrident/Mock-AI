import Link from "next/link"

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and account security."
      />

      <div className="product-panel">
        <div className="product-panel-header">
          <h2 className="text-sm font-semibold">Account settings</h2>
          <p className="text-sm text-muted-foreground">
            Full settings experience ships in a later phase. Profile overview is available now.
          </p>
        </div>
        <div className="product-settings-row">
          <div>
            <p className="text-sm font-medium">Profile overview</p>
            <p className="text-xs text-muted-foreground">View your account summary and membership</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">Open profile</Link>
          </Button>
        </div>
        <Separator />
        <div className="product-settings-row">
          <div>
            <p className="text-sm font-medium">Practice preferences</p>
            <p className="text-xs text-muted-foreground">Coming soon — webcam, voice, and transcript defaults</p>
          </div>
          <Button variant="outline" size="sm" disabled>
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}
