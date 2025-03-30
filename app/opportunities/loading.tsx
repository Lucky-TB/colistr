import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function OpportunitiesLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      {/* Filter Sidebar Skeleton */}
      <div className="hidden lg:block space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="h-[20px] w-2/3" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-[150px]" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-[150px] w-full" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-6">
        {/* Search and Controls Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[80px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 lg:hidden" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

