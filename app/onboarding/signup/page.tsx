import Link from "next/link"
import { redirect } from "next/navigation"
import { Auth0Provider } from "@auth0/nextjs-auth0"
import { SparklesIcon } from "lucide-react"

import { managementClient, onboardingClient } from "@/lib/auth0"
import { SignUpForm } from "./signup-form"

export default async function SignUp() {
  try {
    const session = await onboardingClient.getSession()

    if (session) {
      console.log('[SIGNUP PAGE] User has session, checking organizations')
      
      // Check if user already belongs to an organization
      try {
        const { data: orgs } = await managementClient.users.getUserOrganizations({
          id: session.user.sub,
        })

        console.log('[SIGNUP PAGE] Found', orgs.length, 'organizations')

        if (orgs.length > 0) {
          // User has organizations, redirect to dashboard login
          const authParams = new URLSearchParams({
            organization: orgs[0].id,
            returnTo: "/dashboard",
          })
          console.log('[SIGNUP PAGE] Redirecting to auth/login with org')
          redirect(`/auth/login?${authParams.toString()}`)
        }
      } catch (error) {
        console.error("[SIGNUP PAGE] Error checking organizations:", error)
        // Continue to create org page if we can't check
      }
      
      // No organizations found, proceed to create
      console.log('[SIGNUP PAGE] No orgs, redirecting to create')
      redirect("/onboarding/create")
    }
  } catch (error) {
    console.error('[SIGNUP PAGE] Fatal error:', error)
    // If there's an error, just show the signup form
  }

  return (
    <div className="container relative min-h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col gradient-purple p-6 sm:p-8 lg:p-10 text-white lg:flex">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative z-20 flex items-center text-xl sm:text-2xl font-bold">
          <div className="p-1.5 sm:p-2 rounded-lg bg-white/20 backdrop-blur-sm mr-2 sm:mr-3">
            <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          EventApp
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-3 sm:space-y-4">
            <p className="text-lg sm:text-xl leading-relaxed">
              &ldquo;Create and manage your events with ease. Professional event management and ticketing platform for organizations.&rdquo;
            </p>
            <footer className="text-sm text-white/80">EventApp Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <SignUpForm />
          <p className="px-4 sm:px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
