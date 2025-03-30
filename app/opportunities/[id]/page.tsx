import { Suspense } from "react"
import type { Metadata } from "next"
import OpportunityDetail from "./opportunity-detail"
import OpportunityDetailSkeleton from "./opportunity-detail-skeleton"

export const metadata: Metadata = {
  title: "Investment Opportunity | CoListr",
  description: "View details about this real estate investment opportunity",
}

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<OpportunityDetailSkeleton />}>
        <OpportunityDetail id={params.id} />
      </Suspense>
    </div>
  )
}

