"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyEmail() {
  const [email, setEmail] = useState<string | null>(null)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user.email) {
          setEmail(data.session.user.email)
        }
      } catch (error) {
        console.error("Error getting session:", error)
      }
    }

    getSession()
  }, [supabase])

  const handleResendEmail = async () => {
    if (!email) return

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) throw error

      toast({
        title: "Verification email sent",
        description: "We've sent another verification email to your inbox.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Mail className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-muted-foreground">
          We've sent a verification link to{" "}
          <span className="font-medium text-foreground">{email || "your email address"}</span>
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account and complete your registration. If you don't see the email,
          check your spam folder.
        </p>

        <Button variant="link" className="text-primary" onClick={handleResendEmail}>
          Didn't receive an email? Click to resend
        </Button>
      </div>

      <div className="pt-4">
        <Button asChild variant="outline">
          <Link href="/auth/signin">
            Back to Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

