import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  )
}

