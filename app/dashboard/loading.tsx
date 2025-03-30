import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[100px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-[100px] w-full" />
              ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-[120px] ml-auto" />
          </CardFooter>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-2 w-full mb-2" />
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-[120px] ml-auto" />
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-9 w-[150px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-5 w-[150px]" />
                      <Skeleton className="h-5 w-[60px]" />
                    </div>
                    <Skeleton className="h-4 w-[120px]" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-[40px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-[60px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

