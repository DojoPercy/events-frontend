import { redirect } from "next/navigation"
import { managementClient, onboardingClient } from "@/lib/auth0"

export default async function Callback() {
  const session = await onboardingClient.getSession()

  if (!session) {
    redirect("/onboarding/signup")
  }

  // Check if user belongs to any organization
  try {
    const { data: orgs } = await managementClient.users.getUserOrganizations({
      id: session.user.sub,
    })

    // If user belongs to an organization, redirect to dashboard
    if (orgs.length > 0) {
      const authParams = new URLSearchParams({
        organization: orgs[0].id,
        returnTo: "/dashboard",
      })
      redirect(`/auth/login?${authParams.toString()}`)
    }

    // If no organization, proceed to create one
    redirect("/onboarding/create")
  } catch (error) {
    console.error("Error checking organizations:", error)
    // On error, proceed to create organization
    redirect("/onboarding/create")
  }
}

