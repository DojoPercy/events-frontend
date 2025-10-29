import { redirect } from "next/navigation"
import { onboardingClient } from "@/lib/auth0"

export default async function Callback() {
  const session = await onboardingClient.getSession()

  if (!session) {
    redirect("/onboarding/signup")
  }

  // User is authenticated, redirect to create organization
  redirect("/onboarding/create")
}

