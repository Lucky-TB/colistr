import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function PartnersLoading() {
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
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

