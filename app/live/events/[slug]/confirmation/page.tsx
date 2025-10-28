import Link from "next/link"
import { CheckIcon, ArrowLeftIcon, MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ConfirmationPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ purchaseId?: string }> 
}) {
  const { purchaseId } = await searchParams

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/live/events">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Events
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">EventApp</h1>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href="/dashboard">Admin Login</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Purchase Request Submitted!</CardTitle>
              <CardDescription>
                Your ticket purchase request has been received and is pending approval.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Thank you for your interest in our event! Your purchase request has been submitted successfully.
                </p>
                
                {purchaseId && (
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-medium">Purchase ID: {purchaseId}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep this ID for your records
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Review Process</p>
                      <p className="text-sm text-muted-foreground">
                        Our team will review your purchase request and verify availability.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Email Notification</p>
                      <p className="text-sm text-muted-foreground">
                        You will receive an email confirmation once your purchase is approved.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Event Details</p>
                      <p className="text-sm text-muted-foreground">
                        Once approved, you'll receive all the details you need for the event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                <div className="flex items-start space-x-3">
                  <MailIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Check Your Email
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      We've sent a confirmation email to the address you provided. 
                      Please check your inbox (and spam folder) for updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/live/events">
                    Browse More Events
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/dashboard">
                    Admin Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <h3 className="font-semibold">EventApp</h3>
              <p className="text-sm text-muted-foreground">
                Professional event management and ticketing platform
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">Admin Login</Link>
              <span>•</span>
              <span>© 2024 EventApp</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

