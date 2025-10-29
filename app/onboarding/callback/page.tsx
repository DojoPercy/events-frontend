import { redirect } from "next/navigation"
import { managementClient, onboardingClient } from "@/lib/auth0"

export default async function Callback() {
  try {
    const session = await onboardingClient.getSession()

    if (!session) {
      console.log('[CALLBACK] No session, redirecting to signup')
      redirect("/onboarding/signup")
    }

    console.log('[CALLBACK] Session found, checking organizations for user:', session.user.sub)

    // Check if user belongs to any organization
    try {
      const { data: orgs } = await managementClient.users.getUserOrganizations({
        id: session.user.sub,
      })

      console.log('[CALLBACK] Found', orgs.length, 'organizations')

      // If user belongs to an organization, redirect to dashboard
      if (orgs.length > 0) {
        console.log('[CALLBACK] Redirecting to dashboard via auth/login')
        const authParams = new URLSearchParams({
          organization: orgs[0].id,
          returnTo: "/dashboard",
        })
        redirect(`/auth/login?${authParams.toString()}`)
      }

      // If no organization, proceed to create one
      console.log('[CALLBACK] No organizations, redirecting to create')
      redirect("/onboarding/create")
    } catch (error) {
      console.error("[CALLBACK] Error checking organizations:", error)
      // On error, proceed to create organization
      redirect("/onboarding/create")
    }
  } catch (error) {
    console.error('[CALLBACK] Fatal error:', error)
    // On any error, go to signup
    redirect("/onboarding/signup")
  }
}

