import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({
      req,
      res,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the user is authenticated
    const isAuthenticated = !!session

    // Define protected routes
    const protectedRoutes = ["/dashboard", "/profile", "/opportunities", "/match", "/messages", "/settings"]

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // Redirect if accessing protected route without authentication
    if (isProtectedRoute && !isAuthenticated) {
      const redirectUrl = new URL("/auth/signin", req.url)
      redirectUrl.searchParams.set("from", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect if accessing auth pages while authenticated
    if (req.nextUrl.pathname.startsWith("/auth") && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/opportunities/:path*",
    "/match/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
}

