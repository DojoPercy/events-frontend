"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/spinner"
import { toast } from "sonner"

interface Purchase {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  quantity: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  createdAt: string
  event: {
    id: string
    title: string
    slug: string
    eventDate: string
  }
  ticketType: {
    name: string
    price: number
  }
}

export default function CustomerPurchasesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')

  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [customerEmail, setCustomerEmail] = useState(email || '')

  useEffect(() => {
    if (email) {
      fetchPurchases(email)
    } else {
      setLoading(false)
    }
  }, [email])

  const fetchPurchases = async (emailToFetch: string) => {
    try {
      const response = await fetch(`/api/customer/purchases?email=${encodeURIComponent(emailToFetch)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch purchases')
      }
      const data = await response.json()
      setPurchases(data)
    } catch (error) {
      console.error('Error fetching purchases:', error)
      toast.error('Failed to load your purchases')
    } finally {
      setLoading(false)
    }
  }

  const handleViewPurchases = () => {
    if (!customerEmail) {
      toast.error('Please enter your email address')
      return
    }
    router.push(`/customer/purchases?email=${encodeURIComponent(customerEmail)}`)
    fetchPurchases(customerEmail)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><ClockIcon className="mr-1 h-3 w-3" />Pending</Badge>
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircleIcon className="mr-1 h-3 w-3" />Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircleIcon className="mr-1 h-3 w-3" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading && email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
              <p className="text-muted-foreground">View your ticket purchase requests and status</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/live/events')}>
              Browse Events
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Email Login Form */}
        {!email && (
          <div className="max-w-md mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle>View Your Purchases</CardTitle>
                <CardDescription>
                  Enter your email address to view all your ticket purchase requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewPurchases()}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <Button onClick={handleViewPurchases} className="w-full">
                  View Purchases
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Purchases List */}
        {email && purchases.length > 0 && (
          <div className="space-y-6 mt-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Purchases</h2>
              <p className="text-muted-foreground">Showing purchases for {email}</p>
            </div>

            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{purchase.event.title}</CardTitle>
                      <CardDescription>
                        {purchase.ticketType.name} × {purchase.quantity}
                      </CardDescription>
                    </div>
                    {getStatusBadge(purchase.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(purchase.event.eventDate), "PPP")}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Total:</span>{' '}
                        <span className="font-semibold">
                          ${Number(purchase.totalAmount).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Requested:</span>{' '}
                        {format(new Date(purchase.createdAt), "PPP 'at' p")}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/live/events/${purchase.event.slug}`)}
                      >
                        View Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {email && purchases.length === 0 && !loading && (
          <Card className="mt-12">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't made any ticket purchase requests yet.
              </p>
              <Button onClick={() => router.push('/live/events')}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        )}
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
          </div>
        </div>
      </footer>
    </div>
  )
}

