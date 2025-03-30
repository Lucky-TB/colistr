import type { Metadata } from "next"
import { Suspense } from "react"
import OpportunitiesView from "./opportunities-view"
import OpportunitiesLoading from "./loading"

export const metadata: Metadata = {
  title: "Investment Opportunities | CoListr",
  description:
    "Browse and filter real estate investment opportunities on CoListr. Find properties that match your investment criteria and connect with potential partners.",
  keywords: "real estate investment, property opportunities, co-investment, real estate listings",
}

export default function OpportunitiesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Investment Opportunities</h1>
      <p className="text-muted-foreground mb-8">
        Browse through available real estate investment opportunities or create your own listing.
      </p>

      <Suspense fallback={<OpportunitiesLoading />}>
        <OpportunitiesView />
      </Suspense>
    </main>
  )
}

