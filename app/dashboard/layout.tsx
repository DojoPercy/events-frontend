import Link from "next/link"
import { redirect } from "next/navigation"
import { Auth0Provider } from "@auth0/nextjs-auth0"
import { SettingsIcon, CalendarIcon, ShoppingCartIcon } from "lucide-react"

import { appClient, managementClient } from "@/lib/auth0"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { OrganizationSwitcher } from "@/components/organization-switcher"
import { UserNav } from "@/components/user-nav"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await appClient.getSession()

  console.log('=== DASHBOARD LAYOUT DEBUG ===')
  console.log('Session exists:', !!session?.user)
  if (session?.user) {
    console.log('User email:', session.user.email)
    console.log('User org_id:', session.user.org_id)
  }

  // if the user is not authenticated, redirect to login
  if (!session?.user) {
    redirect("/auth/login")
  }

  const { data: orgs } = await managementClient.users.getUserOrganizations({
    id: session.user.sub,
  })
  
  console.log('User organizations found:', orgs.length)
  if (orgs.length > 0) {
    console.log('  First org:', orgs[0].id, '-', orgs[0].display_name)
  }

  // If user doesn't have org_id in session but has orgs, log it but continue
  if (!session.user.org_id && orgs.length > 0) {
    console.log('User has orgs but no org_id in session. Using first org:', orgs[0].id)
    // The organization switcher can still work without org_id being set in session
    // as long as we have orgs list
  }
  
  // if the user does not belong to any organizations, redirect to onboarding
  if (!orgs.length) {
    console.log('No organizations found, redirecting to onboarding/create')
    return redirect("/onboarding/create")
  }

  return (
    <Auth0Provider>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-2 py-4 sm:px-8">
        <div className="flex items-center space-x-6">
          <OrganizationSwitcher
            organizations={orgs.map((o) => ({
              id: o.id,
              slug: o.name,
              displayName: o.display_name!,
              logoUrl: o.branding?.logo_url,
            }))}
            currentOrgId={session.user.org_id!}
          />

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/dashboard/events"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <CalendarIcon className="mr-1 inline h-4 w-4" />
              Events
            </Link>
            <Link
              href="/dashboard/purchases"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ShoppingCartIcon className="mr-1 inline h-4 w-4" />
              Purchases
            </Link>
          </div>
        </div>

        <div className="flex flex-row gap-x-4">
          <Button variant="ghost" asChild className="px-2 py-2">
            <Link href="/dashboard/organization/general">
              <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
          <UserNav />
        </div>
      </nav>

      <main className="mx-auto grid min-h-[calc(100svh-164px)] max-w-7xl px-2 sm:px-8 lg:py-6">
        {children}
      </main>

      <footer className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <div className="font-mono font-semibold">
              <Link href="/">EventApp</Link>
            </div>

            <div>
              <Button variant="link" asChild>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/live/events">Public Events</Link>
              </Button>
            </div>
          </div>

          <div className="items-center gap-x-2">
            <ModeToggle />
          </div>
        </div>
      </footer>
    </Auth0Provider>
  )
}

