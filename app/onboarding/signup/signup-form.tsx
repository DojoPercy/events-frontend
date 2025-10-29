"use client"

import { useState } from "react"
import Link from "next/link"
import { MailIcon, CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-center">Create Your Account</h2>
        <p className="text-sm text-muted-foreground text-center">
          Get started with EventApp today
        </p>
      </div>
      
      {/* Link to onboarding login route - middleware will handle with onboardingClient */}
      <Button asChild className="w-full" size="lg">
        <a href="/onboarding/login">
          <MailIcon className="mr-2 h-4 w-4" />
          Sign Up with Email
        </a>
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
      </p>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <a href="/auth/login?returnTo=/dashboard" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </div>
    </div>
  )
}

