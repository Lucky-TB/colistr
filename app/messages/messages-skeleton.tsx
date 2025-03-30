import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function MessagesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <div className="space-y-2">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-8" />
                </div>
              </Card>
            ))}
        </div>
      </div>

      <Card className="p-6 flex flex-col h-[600px]">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}>
                  <Skeleton className={`h-20 w-full rounded-lg`} />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
            ))}
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </Card>
    </div>
  )
}

