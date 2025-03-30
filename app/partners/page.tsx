import type { Metadata } from "next"
import { Suspense } from "react"
import PartnersView from "./partners-view"
import PartnersLoading from "./loading"

export const metadata: Metadata = {
  title: "Find Partners | CoListr",
  description:
    "Connect with real estate professionals to find your perfect co-investment partner. Filter by experience, investment capacity, and more.",
  keywords: "real estate partners, co-investment, real estate networking, property investment partners",
}

export default function PartnersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Find Partners</h1>
      <p className="text-muted-foreground mb-8">
        Connect with real estate professionals who match your investment criteria and goals.
      </p>

      <Suspense fallback={<PartnersLoading />}>
        <PartnersView />
      </Suspense>
    </main>
  )
}

