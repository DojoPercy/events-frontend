"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarIcon, PlusIcon, ShoppingCartIcon, UsersIcon, TrendingUpIcon, SparklesIcon, EyeIcon } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Event {
  id: string
  title: string
  isPublished: boolean
  createdAt: string
  ticketTypes: Array<{
    sold: number
  }>
}

interface Purchase {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  quantity: number
  totalAmount: number
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, purchasesRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/purchases')
        ])

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          setEvents(eventsData)
        }

        if (purchasesRes.ok) {
          const purchasesData = await purchasesRes.json()
          setPurchases(purchasesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalEvents = events.length
  const pendingPurchases = purchases.filter(p => p.status === 'PENDING').length
  const totalTicketsSold = purchases
    .filter(p => p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.quantity, 0)
  const revenue = purchases
    .filter(p => p.status === 'APPROVED')
    .reduce((sum, p) => sum + Number(p.totalAmount), 0)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-2xl gradient-purple p-8 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Welcome Back!</h1>
              <p className="text-white/80 text-lg">
                Manage your events and track ticket purchases
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CalendarIcon, title: "Total Events", value: loading ? "..." : totalEvents.toString(), subtitle: "Events created", color: "purple" },
          { icon: ShoppingCartIcon, title: "Pending Purchases", value: loading ? "..." : pendingPurchases.toString(), subtitle: "Awaiting approval", color: "orange" },
          { icon: UsersIcon, title: "Total Tickets Sold", value: loading ? "..." : totalTicketsSold.toString(), subtitle: "Approved purchases", color: "blue" },
          { icon: TrendingUpIcon, title: "Revenue", value: loading ? "..." : `$${revenue.toFixed(2)}`, subtitle: "From approved tickets", color: "green" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" size="lg">
                <Link href="/dashboard/events/create">
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Create New Event
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start hover:bg-primary/5" size="lg">
                <Link href="/dashboard/events">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Manage Events
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start hover:bg-primary/5" size="lg">
                <Link href="/dashboard/purchases">
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Review Purchases
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Recent Events</CardTitle>
              <CardDescription>
                Your latest events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground text-center">
                    No events yet. Create your first event to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Badge variant={event.isPublished ? "default" : "secondary"} className="ml-2">
                        {event.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  ))}
                  {events.length > 5 && (
                    <Button variant="ghost" className="w-full mt-2" asChild>
                      <Link href="/dashboard/events">
                        View All Events
                        <EyeIcon className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

