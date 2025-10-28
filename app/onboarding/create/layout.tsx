import Link from "next/link"
import { redirect } from "next/navigation"
import { Auth0Provider } from "@auth0/nextjs-auth0"

import { managementClient, onboardingClient } from "@/lib/auth0"

export default async function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await onboardingClient.getSession()

  if (!session) {
    return redirect("/onboarding/signup")
  }

  // Check if user already belongs to an organization
  const { data: orgs } = await managementClient.users.getUserOrganizations({
    id: session.user.sub,
  })

  if (orgs.length > 0) {
    // User has organizations, redirect to dashboard login
    const authParams = new URLSearchParams({
      organization: orgs[0].id,
      returnTo: "/dashboard",
    })
    return redirect(`/auth/login?${authParams.toString()}`)
  }

  // fetch the latest user data to ensure that the `email_verified` is not stale
  const user = await fetch(
    new URL("/userinfo", `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}`),
    {
      headers: {
        Authorization: `Bearer ${(await onboardingClient.getAccessToken()).token}`,
      },
    }
  ).then((res) => res.json())

  // user must verify their e-mail first to create your account
  if (!user.email_verified) {
    return redirect("/onboarding/verify")
  }

  return (
    <Auth0Provider>
      <main className="min-h-screen">{children}</main>
    </Auth0Provider>
  )
}

