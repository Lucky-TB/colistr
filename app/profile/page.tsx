import { Suspense } from "react"
import type { Metadata } from "next"
import ProfileView from "./profile-view"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Your Profile | CoListr",
  description: "Manage your professional profile and investment preferences",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your professional information and investment preferences.</p>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileView />
      </Suspense>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="md:w-2/3 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

