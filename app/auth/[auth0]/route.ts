import { appClient, onboardingClient } from "@/lib/auth0"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  const { auth0 } = await params
  const searchParams = request.nextUrl.searchParams
  const organization = searchParams.get("organization")
  const returnTo = searchParams.get("returnTo") || "/dashboard"

  console.log('[AUTH ROUTE]', auth0, 'organization:', organization, 'returnTo:', returnTo)

  // Handle login with organization
  if (auth0 === "login" && organization) {
    console.log('[AUTH ROUTE] Login with organization:', organization)
    return appClient.startInteractiveLogin({
      authorizationParameters: {
        organization,
      },
      returnTo,
    })
  }

  // For all other routes (login without org, logout, callback), use middleware
  // The middleware will handle these based on the client configuration
  console.log('[AUTH ROUTE] Delegating to middleware for:', auth0)
  
  // Determine which client to use based on context
  const client = organization ? appClient : onboardingClient
  return client.middleware(request)
}

