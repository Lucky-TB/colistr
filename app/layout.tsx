import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/components/providers/supabase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CoListr | Real Estate Co-Investment Platform",
  description: "Connect with real estate professionals to find co-investment partners for property opportunities.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SupabaseProvider>{children}</SupabaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}