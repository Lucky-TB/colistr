"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  Heart,
  Settings,
  HelpCircle,
  Menu,
  X,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Find Partners",
    href: "/match",
    icon: Users,
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    icon: Building2,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Saved",
    href: "/saved",
    icon: Heart,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] pr-0">
          <MobileSidebar pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <aside className="hidden w-[240px] flex-col border-r bg-background lg:flex">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`justify-start ${pathname === item.href ? "bg-secondary" : ""}`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}

function MobileSidebar({
  pathname,
  setOpen,
}: {
  pathname: string
  setOpen: (open: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-xl font-bold">
            Co<span className="text-accent">Listr</span>
          </span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 px-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={`justify-start ${pathname === item.href ? "bg-secondary" : ""}`}
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

