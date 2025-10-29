import { appClient, onboardingClient } from "@/lib/auth0"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  const { auth0 } = await params
  const searchParams = request.nextUrl.searchParams
  const organization = searchParams.get("organization")
  const invitation = searchParams.get("invitation")
  const returnTo = searchParams.get("returnTo") || "/dashboard"
  const screenHint = searchParams.get("screen_hint")

  console.log('[AUTH ROUTE]', auth0, 'organization:', organization, 'invitation:', invitation, 'returnTo:', returnTo)

  // Handle login with organization invitation
  if (auth0 === "login" && organization && invitation) {
    console.log('[AUTH ROUTE] Login with invitation:', invitation, 'for organization:', organization)
    
    const authParams: any = {
      organization,
      invitation,
    }

    // Add screen_hint if provided (signup vs login)
    if (screenHint) {
      authParams.screen_hint = screenHint
    }

    return appClient.startInteractiveLogin({
      authorizationParameters: authParams,
      returnTo,
    })
  }

  // Handle login with organization (no invitation)
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

