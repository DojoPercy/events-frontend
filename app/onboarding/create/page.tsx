import Link from "next/link"
import { redirect } from "next/navigation"
import { Auth0Provider } from "@auth0/nextjs-auth0"
import { SparklesIcon } from "lucide-react"

import { onboardingClient } from "@/lib/auth0"
import { CreateOrganizationForm } from "./create-organization-form"

export default async function Create() {
  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left gradient panel */}
      <div className="relative hidden h-full flex-col gradient-purple p-10 text-white lg:flex">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative z-20 flex items-center text-2xl font-bold">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm mr-3">
            <SparklesIcon className="w-6 h-6" />
          </div>
          EventApp
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-xl leading-relaxed">
              &ldquo;Create and manage your events with ease. Professional event management and ticketing platform for organizations.&rdquo;
            </p>
            <footer className="text-sm text-white/80">EventApp Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Right content */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Create an organization
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your organization name to create an account.
            </p>
          </div>

          <div className="rounded-xl border bg-card/80 backdrop-blur p-6 shadow-md">
            <CreateOrganizationForm />
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

