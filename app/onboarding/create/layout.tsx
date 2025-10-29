import Link from "next/link"
import { redirect } from "next/navigation"
import { Auth0Provider } from "@auth0/nextjs-auth0"

import { managementClient, onboardingClient } from "@/lib/auth0"

export default async function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let session
  
  try {
    session = await onboardingClient.getSession()

    if (!session) {
      console.log('[CREATE LAYOUT] No session, redirecting to signup')
      return redirect("/onboarding/signup")
    }

    console.log('[CREATE LAYOUT] Checking organizations for user:', session.user.sub)

    // Check if user already belongs to an organization
    try {
      const { data: orgs } = await managementClient.users.getUserOrganizations({
        id: session.user.sub,
      })

      console.log('[CREATE LAYOUT] Found', orgs.length, 'organizations')

      if (orgs.length > 0) {
        // User has organizations, redirect to dashboard login
        console.log('[CREATE LAYOUT] Redirecting to auth/login with org')
        const authParams = new URLSearchParams({
          organization: orgs[0].id,
          returnTo: "/dashboard",
        })
        return redirect(`/auth/login?${authParams.toString()}`)
      }
    } catch (orgError) {
      console.error('[CREATE LAYOUT] Error checking organizations:', orgError)
      // Continue to show create form if we can't check orgs
    }
  } catch (error) {
    console.error('[CREATE LAYOUT] Fatal error getting session:', error)
    return redirect("/onboarding/signup")
  }

  // Fetch the latest user data to ensure that the `email_verified` is not stale
  try {
    const user = await fetch(
      new URL("/userinfo", `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}`),
      {
        headers: {
          Authorization: `Bearer ${(await onboardingClient.getAccessToken()).token}`,
        },
      }
    ).then((res) => res.json())

    // User must verify their e-mail first to create your account
    if (!user.email_verified) {
      console.log('[CREATE LAYOUT] Email not verified, redirecting to verify')
      return redirect("/onboarding/verify")
    }
  } catch (error) {
    console.error('[CREATE LAYOUT] Error fetching user info:', error)
    // Continue to show create form even if we can't verify email
  }

  return (
    <Auth0Provider>
      <main className="min-h-screen">{children}</main>
    </Auth0Provider>
  )
}

