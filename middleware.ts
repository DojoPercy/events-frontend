import type { NextRequest } from "next/server"
import { appClient, onboardingClient } from "./lib/auth0"

export async function middleware(request: NextRequest) {
  // Route onboarding traffic to onboardingClient (no org required)
  if (request.nextUrl.pathname.startsWith("/onboarding")) {
    return await onboardingClient.middleware(request)
  }
  
  // Route all other traffic to appClient (requires org context)
  return await appClient.middleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - live/events (public storefront)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png|live|api).*)",
  ],
}

