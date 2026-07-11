"use client"

import Link from "next/link"

import { ProductLogo } from "@/components/shared/ProductLogo"
import { ProPlanCard } from "@/components/shared/ProPlanCard"
import {
  isNavItemActive,
  primaryNavItems,
  secondaryNavItems,
  type NavItem,
} from "@/components/shared/nav-config"
import { UserMenu } from "@/components/shared/UserMenu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type SidebarProps = {
  pathname: string
  user: {
    name: string
    email: string
    imageUrl?: string
  }
}

function SidebarNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = isNavItemActive(item, pathname)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "product-nav-link",
        isActive ? "product-nav-link--active" : "product-nav-link--inactive"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {item.label}
    </Link>
  )
}

export function Sidebar({ pathname, user }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="p-4">
        <ProductLogo />
      </div>

      <nav className="flex flex-col gap-0.5 px-3" aria-label="Primary">
        {primaryNavItems.map((item) => (
          <SidebarNavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <Separator className="my-3" />

      <nav className="flex flex-col gap-0.5 px-3" aria-label="Account">
        {secondaryNavItems.map((item) => (
          <SidebarNavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="mt-auto space-y-3 pb-4">
        <ProPlanCard />
        <div className="px-3">
          <UserMenu user={user} variant="sidebar" />
        </div>
      </div>
    </div>
  )
}
