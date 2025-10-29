"use client"

import Link from "next/link"
import { CalendarIcon, UsersIcon, TicketIcon, ShieldIcon, StarIcon, CheckIcon, SparklesIcon, ArrowRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@auth0/nextjs-auth0"

export default function LandingPage() {
  const session = useUser()
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
            <Button variant="gradient" size="default" className="text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10" asChild>
              <Link href={session.user ? "/dashboard" : "/login"}>
                <span className="hidden sm:inline">{session.user ? "Dashboard" : "Get Started"}</span>
                <span className="sm:hidden">{session.user ? "Dashboard" : "Get Started"}</span>
                <ArrowRightIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative gradient-purple text-white overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight"
            >
              Professional Event Management
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Made Simple
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-white/80 px-4"
            >
              Create, manage, and sell tickets for your events with our comprehensive platform. 
              Perfect for organizations, venues, and event organizers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
            >
              <Button size="lg" className="bg-white text-black hover:bg-white/90 w-full sm:w-auto" asChild>
                <Link href="/login">
                  Start Free Trial
                  <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 w-full sm:w-auto" asChild>
                <Link href="/live/events">View Events</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
            >
              Everything you need to manage events
            </motion.h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
              From creation to completion, we've got you covered
            </p>
          </div>
          <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CalendarIcon, title: "Event Creation", description: "Easily create and customize events with detailed information, dates, and locations." },
              { icon: TicketIcon, title: "Ticket Management", description: "Create multiple ticket types with different pricing and availability options." },
              { icon: UsersIcon, title: "Customer Management", description: "Track customer information and manage purchase approvals efficiently." },
              { icon: ShieldIcon, title: "Approval Workflow", description: "Review and approve ticket purchases with automated email notifications." },
              { icon: StarIcon, title: "Professional Branding", description: "Customize your event pages with your organization's branding and colors." },
              { icon: CheckIcon, title: "Easy Integration", description: "Seamlessly integrate with your existing systems and workflows." },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full">
                  <CardHeader>
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative gradient-purple text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white dark:text-white">
              Ready to get started?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-white/80 px-4">
              Join thousands of organizations already using EventApp to manage their events.
            </p>
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-x-4 sm:gap-x-6">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 w-full sm:w-auto" asChild>
                <Link href="/login">
                  Create Your First Event
                  <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <SparklesIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  EventApp
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional event management and ticketing platform for organizations.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/live/events" className="hover:text-primary transition-colors">Events</Link></li>
                <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EventApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}