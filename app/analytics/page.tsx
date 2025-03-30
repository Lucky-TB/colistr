import { Suspense } from "react"
import type { Metadata } from "next"
import AnalyticsView from "./analytics-view"
import AnalyticsSkeleton from "./analytics-skeleton"

export const metadata: Metadata = {
  title: "Analytics | CoListr",
  description: "Track your investment performance and platform activity",
}

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Analytics</h1>
      <p className="text-muted-foreground mb-8">Track your investment performance and platform activity.</p>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsView />
      </Suspense>
    </div>
  )
}

