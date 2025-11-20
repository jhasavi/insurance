import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const RATE_LIMIT = 20 // requests per minute
const WINDOW = 60 * 1000 // 1 minute
const ipMap = new Map<string, { count: number, start: number }>()

export default withAuth(
  function middleware(req) {
    // Rate limiting for API and auth routes
    if (req.nextUrl.pathname.startsWith("/api") || req.nextUrl.pathname.startsWith("/auth")) {
      const ip = req.headers.get("x-forwarded-for") || "unknown"
      const now = Date.now()
      const entry = ipMap.get(ip) || { count: 0, start: now }
      if (now - entry.start > WINDOW) {
        entry.count = 0
        entry.start = now
      }
      entry.count++
      ipMap.set(ip, entry)
      if (entry.count > RATE_LIMIT) {
        return new NextResponse("Rate limit exceeded", { status: 429 })
      }
    }

    // Only require auth for protected routes
    const protectedRoutes = ["/admin", "/settings", "/api/private"];
    const isProtected = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (isProtected && !token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only require auth for protected routes
      authorized: ({ req, token }) => {
        const protectedRoutes = ["/admin", "/settings", "/api/private"];
        const isProtected = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
        if (!isProtected) return true;
        return !!token;
      },
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    "/compare/new",
    "/compare/results/:path*",
    "/scan/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/api/:path*",
    "/auth/:path*",
  ],
}
