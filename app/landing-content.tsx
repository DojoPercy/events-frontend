"use client"

import Link from "next/link"
import { CalendarIcon, UsersIcon, TicketIcon, ShieldIcon, StarIcon, CheckIcon, SparklesIcon, ArrowRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingContent({ hasSession }: { hasSession: boolean }) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              EventApp
            </span>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            <Link href="/live/events" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors hidden sm:inline-block">
              Events
            </Link>
            <Link href="/contact" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors hidden md:inline-block">
              Contact
            </Link>
            {hasSession ? (
              <Button variant="gradient" size="default" className="text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10" asChild>
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRightIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="gradient" size="default" className="text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10" asChild>
                <Link href="/login">
                  Get Started
                  <ArrowRightIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        
        <div className="container relative px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 sm:mb-8 inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            >
              <SparklesIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Professional Event Management Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              Create Amazing Events with{" "}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                EventApp
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground px-4"
            >
              The all-in-one platform for managing events, selling tickets, and tracking attendees. Powerful, simple, and designed for success.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            >
              <Button size="lg" className="bg-white text-black hover:bg-white/90 w-full sm:w-auto" asChild>
                <Link href="/login">
                  Create Your First Event
                  <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/live/events">Browse Events</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Powerful features to manage your events from start to finish
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CalendarIcon,
                title: "Event Management",
                description: "Create and manage events with ease. Set dates, locations, and customize every detail.",
              },
              {
                icon: TicketIcon,
                title: "Ticket Sales",
                description: "Sell tickets online with multiple types, pricing tiers, and capacity management.",
              },
              {
                icon: UsersIcon,
                title: "Attendee Tracking",
                description: "Track registrations, manage check-ins, and communicate with attendees.",
              },
              {
                icon: ShieldIcon,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with Auth0 authentication and secure payment processing.",
              },
              {
                icon: StarIcon,
                title: "Custom Branding",
                description: "Customize your event pages with your brand colors, logos, and styling.",
              },
              {
                icon: CheckIcon,
                title: "Approval Workflows",
                description: "Optional ticket approval process for exclusive or invite-only events.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center text-white"
          >
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-purple-100">
              Join thousands of event organizers who trust EventApp for their events
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 w-full sm:w-auto" asChild>
              <Link href="/login">
                Start Free Trial
                <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-base sm:text-lg font-bold">EventApp</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © 2024 EventApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

