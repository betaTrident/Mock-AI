import {
  BookOpenIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  MicIcon,
  SettingsIcon,
  Share2Icon,
  UserIcon,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  match?: (pathname: string) => boolean
}

export const primaryNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    match: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/interviews",
    label: "Interviews",
    icon: MicIcon,
    match: (pathname) =>
      pathname.startsWith("/interview") && !pathname.includes("/feedback"),
  },
  {
    href: "/feedback",
    label: "Feedback",
    icon: MessageSquareTextIcon,
    match: (pathname) =>
      pathname === "/feedback" || pathname.includes("/feedback"),
  },
  {
    href: "/practice-plan",
    label: "Practice Plan",
    icon: BookOpenIcon,
    match: (pathname) => pathname.startsWith("/practice-plan"),
  },
  {
    href: "/shared-reports",
    label: "Shared Reports",
    icon: Share2Icon,
    match: (pathname) => pathname.startsWith("/shared-reports"),
  },
]

export const secondaryNavItems: NavItem[] = [
  {
    href: "/profile",
    label: "Profile",
    icon: UserIcon,
    match: (pathname) => pathname === "/profile",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    match: (pathname) => pathname.startsWith("/settings"),
  },
]

export const allNavItems = [...primaryNavItems, ...secondaryNavItems]

export function isNavItemActive(item: NavItem, pathname: string) {
  if (item.match) return item.match(pathname)
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
