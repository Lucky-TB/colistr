import { Suspense } from "react"
import type { Metadata } from "next"
import MessagesView from "./messages-view"
import MessagesSkeleton from "./messages-skeleton"

export const metadata: Metadata = {
  title: "Messages | CoListr",
  description: "Communicate with potential investment partners",
}

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-muted-foreground mb-8">Communicate with potential investment partners.</p>

      <Suspense fallback={<MessagesSkeleton />}>
        <MessagesView />
      </Suspense>
    </div>
  )
}

