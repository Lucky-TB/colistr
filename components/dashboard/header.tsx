"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, MessageSquare, Search } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getUnreadMessageCount } from "@/actions/messages"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader() {
  const pathname = usePathname()
  const { user, supabase } = useSupabase()
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return

      try {
        const count = await getUnreadMessageCount(user.id)
        setUnreadMessages(count)
      } catch (error) {
        console.error("Error fetching unread message count:", error)
      }
    }

    fetchUnreadCount()

    // Set up polling for unread messages
    const intervalId = setInterval(fetchUnreadCount, 30000) // Poll every 30 seconds

    return () => clearInterval(intervalId)
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link href="/" className="hidden lg:flex items-center gap-2">
        <span className="text-xl font-bold">
          Co<span className="text-accent">Listr</span>
        </span>
      </Link>

      <div className="w-full flex-1 md:grow-0 md:w-[400px] lg:w-[500px]">
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search opportunities, partners..."
            className="w-full bg-background pl-8 md:w-[400px] lg:w-[500px]"
          />
        </form>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadMessages > 9 ? "9+" : unreadMessages}
              </span>
            )}
          </Link>
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/messages">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Link>
        </Button>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata.avatar_url || ""} alt={user?.user_metadata.full_name || "User"} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.user_metadata.full_name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/analytics">Analytics</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

