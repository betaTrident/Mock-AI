import Link from "next/link"

import { Button } from "@/components/ui/button"

export function ProPlanCard() {
  return (
    <div className="product-panel mx-3 mb-3 overflow-hidden">
      <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Pro Plan</p>
        <p className="mt-1 text-xs text-muted-foreground">Renews May 24, 2025</p>
        <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
          <Link href="/settings">Manage Plan</Link>
        </Button>
      </div>
    </div>
  )
}
