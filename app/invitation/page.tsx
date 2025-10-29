import { redirect } from "next/navigation"
import { appClient } from "@/lib/auth0"

interface InvitationPageProps {
  searchParams: Promise<{
    invitation?: string
    organization?: string
    organization_name?: string
  }>
}

export default async function InvitationPage({ searchParams }: InvitationPageProps) {
  const params = await searchParams
  const { invitation, organization, organization_name } = params

  // If no invitation or organization, redirect to login
  if (!invitation || !organization) {
    redirect("/auth/login")
  }

  // Check if user is already logged in
  const session = await appClient.getSession()

  if (session) {
    // User is logged in, redirect to Auth0 to complete invitation acceptance
    // Auth0 will handle adding the user to the organization
    const authParams = new URLSearchParams({
      invitation,
      organization,
      returnTo: "/dashboard",
    })
    
    redirect(`/auth/login?${authParams.toString()}`)
  }

  // User is not logged in, show a page prompting them to sign up/login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
            You're Invited!
          </h1>
          
          {organization_name && (
            <p className="text-lg text-gray-700 mb-4">
              Join <strong>{decodeURIComponent(organization_name)}</strong> on EventApp
            </p>
          )}
          
          <p className="text-gray-600 mb-6">
            Accept this invitation to collaborate on events and manage tickets together.
          </p>

          <div className="space-y-3">
            <a
              href={`/auth/login?${new URLSearchParams({
                invitation,
                organization,
                returnTo: "/dashboard",
                screen_hint: "signup",
              }).toString()}`}
              className="block w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Accept Invitation & Sign Up
            </a>
            
            <a
              href={`/auth/login?${new URLSearchParams({
                invitation,
                organization,
                returnTo: "/dashboard",
              }).toString()}`}
              className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-200 transition-colors"
            >
              Accept Invitation & Log In
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            By accepting, you'll get access to the organization's events and team collaboration features.
          </p>
        </div>
      </div>
    </div>
  )
}

