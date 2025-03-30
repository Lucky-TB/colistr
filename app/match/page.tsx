import { Suspense } from "react"
import type { Metadata } from "next"
import MatchView from "./match-view"
import MatchSkeleton from "./match-skeleton"

export const metadata: Metadata = {
  title: "Find Partners | CoListr",
  description: "Find compatible real estate investment partners based on your preferences",
}

export default function MatchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Find Partners</h1>
      <p className="text-muted-foreground mb-8">
        Discover compatible real estate professionals based on your investment preferences.
      </p>

      <Suspense fallback={<MatchSkeleton />}>
        <MatchView />
      </Suspense>
    </div>
  )
}

