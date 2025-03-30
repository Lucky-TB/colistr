import type React from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - CoListr",
  description: "Sign in or create an account on CoListr",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block relative hero-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-10 text-white">
          <Link href="/" className="absolute top-8 left-8">
            <span className="text-2xl font-bold">
              Co<span className="text-gold">Listr</span>
            </span>
          </Link>
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold mb-6">Connect with Real Estate Professionals</h1>
            <p className="text-lg mb-8">
              Join our community of verified real estate agents and find your perfect co-investment partners.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gold">5,000+</h3>
                <p className="text-sm">Verified Realtors</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gold">1,200+</h3>
                <p className="text-sm">Active Listings</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gold">850+</h3>
                <p className="text-sm">Successful Matches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 text-center">
            <Link href="/">
              <span className="text-2xl font-bold">
                Co<span className="text-accent">Listr</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

