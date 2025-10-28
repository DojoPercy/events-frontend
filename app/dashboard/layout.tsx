import Link from "next/link"
import { redirect } from "next/navigation"
import { Auth0Provider } from "@auth0/nextjs-auth0"
import { SettingsIcon, CalendarIcon, ShoppingCartIcon, SparklesIcon } from "lucide-react"

import { appClient, managementClient } from "@/lib/auth0"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { OrganizationSwitcher } from "@/components/organization-switcher"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"

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
      <nav className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <MobileNav>
              <div className="px-4 py-2">
                <OrganizationSwitcher
                  organizations={orgs.map((o) => ({
                    id: o.id,
                    slug: o.name,
                    displayName: o.display_name!,
                    logoUrl: o.branding?.logo_url,
                  }))}
                  currentOrgId={session.user.org_id!}
                />
              </div>
            </MobileNav>
            
            {/* Logo/Brand - visible on mobile */}
            <Link href="/dashboard" className="flex items-center space-x-2 md:hidden">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <SparklesIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                EventApp
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <OrganizationSwitcher
              organizations={orgs.map((o) => ({
                id: o.id,
                slug: o.name,
                displayName: o.display_name!,
                logoUrl: o.branding?.logo_url,
              }))}
              currentOrgId={session.user.org_id!}
            />

            <div className="flex items-center space-x-1 lg:space-x-4">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-lg"
              >
                Home
              </Link>
              <Link
                href="/dashboard/events"
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-lg flex items-center"
              >
                <CalendarIcon className="mr-1.5 h-4 w-4" />
                Events
              </Link>
              <Link
                href="/dashboard/purchases"
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-lg flex items-center"
              >
                <ShoppingCartIcon className="mr-1.5 h-4 w-4" />
                Purchases
              </Link>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-x-2">
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/dashboard/organization/general">
                <SettingsIcon className="h-5 w-5" />
              </Link>
            </Button>
            <UserNav />
          </div>
        </div>
      </nav>

      <main className="mx-auto min-h-[calc(100vh-120px)] max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {children}
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <SparklesIcon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  EventApp
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <Button variant="link" size="sm" asChild>
                  <Link href="/">Home</Link>
                </Button>
                <Button variant="link" size="sm" asChild>
                  <Link href="/live/events">Public Events</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </footer>
    </Auth0Provider>
  )
}

