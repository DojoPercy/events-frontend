import { redirect } from "next/navigation"
import { managementClient, appClient } from "@/lib/auth0"

export default async function LoginPage() {
  const session = await appClient.getSession()
  
  // If user is already logged in, check their organizations
  if (session?.user) {
    console.log('=== LOGIN PAGE DEBUG ===')
    console.log('Logged in user email:', session.user.email)
    console.log('User sub:', session.user.sub)
    
    const { data: orgs } = await managementClient.users.getUserOrganizations({
      id: session.user.sub,
    })
    
    console.log('User organizations:', orgs.length)
    orgs.forEach((org, idx) => {
      console.log(`  Org ${idx + 1}:`, org.id, '-', org.display_name || org.name)
    })

    if (orgs.length > 0) {
      // User has organizations and is logged in, check if they're in the dashboard context
      // If they have an org_id in session, they're already in a dashboard
      if (session.user.org_id) {
        console.log('User already in org context, redirecting to dashboard')
        // Already logged in with an organization, go to dashboard
        return redirect("/dashboard")
      }
      
      // User has orgs but needs to login with one
      console.log('User has orgs but no org_id in session, redirecting to login with org:', orgs[0].id)
      const authParams = new URLSearchParams({
        organization: orgs[0].id,
        returnTo: "/dashboard",
      })
      return redirect(`/auth/login?${authParams.toString()}`)
    }

    // User has no organizations, redirect to create one
    console.log('User has no organizations, redirecting to create')
    return redirect("/onboarding/create")
  }
  
  // User not logged in, show login page by redirecting to signup flow
  return redirect("/onboarding/signup")
}

