"use client"

import Link from "next/link"
import { MailIcon, RefreshCwIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Verify() {
  const handleResendEmail = () => {
    // This would trigger a resend verification email
    window.location.href = "/auth/login?prompt=login"
  }

  return (
    <div className="container relative min-h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left gradient panel */}
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
              &ldquo;Please check your email to verify your account and continue with creating your organization.&rdquo;
            </p>
            <footer className="text-sm text-white/80">EventApp Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Right content */}
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:space-y-6 sm:w-[380px]">
          <Card className="border-0 shadow-md">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="mx-auto mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10">
                <MailIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Check your email</CardTitle>
              <CardDescription className="text-sm">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <Button onClick={handleResendEmail} variant="outline" className="w-full">
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Resend verification email
              </Button>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

