"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-destructive">Something went wrong!</h1>
      <p className="mt-4 text-muted-foreground max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      {error.message && (
        <div className="mt-4 p-4 bg-destructive/10 rounded-md max-w-md">
          <p className="text-sm text-destructive">{error.message}</p>
        </div>
      )}
      <div className="mt-8 flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

