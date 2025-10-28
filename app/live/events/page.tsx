"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarIcon, MapPinIcon, ClockIcon, SparklesIcon, TicketIcon, TrendingUpIcon } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/spinner"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  description: string
  slug: string
  eventDate: Date | string
  venue?: string
  location?: string
  isPublished: boolean
  coverImageUrl?: string
  ticketTypes: Array<{
    name: string
    price: number
    quantity: number
    sold: number
    isActive: boolean
  }>
}

export default function PublicEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events/published')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const now = new Date()
  const upcomingEvents = events.filter(event => {
    const eventDate = typeof event.eventDate === 'string' ? new Date(event.eventDate) : event.eventDate
    return eventDate >= now
  })
  const pastEvents = events.filter(event => {
    const eventDate = typeof event.eventDate === 'string' ? new Date(event.eventDate) : event.eventDate
    return eventDate < now
  })

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents

  // Generate random gradient color based on event ID
  const getEventGradient = (eventId: string) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-purple-500',
      'from-indigo-500 to-purple-500',
      'from-violet-500 to-purple-500',
      'from-purple-500 to-rose-500',
      'from-fuchsia-500 to-purple-500',
    ]
    const index = parseInt(eventId.slice(-2), 16) % gradients.length
    return gradients[index]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const displayLocation = (event: Event) => event.venue || event.location || "Location TBD"
  const getEventDate = (event: Event) => typeof event.eventDate === 'string' ? new Date(event.eventDate) : event.eventDate

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative gradient-purple text-white">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">EventApp</h1>
                <p className="text-white/80">Discover amazing events near you</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Tabs */}
        <div className="mb-8 flex items-center justify-center gap-4 w-full">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              activeTab === 'upcoming'
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              activeTab === 'past'
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            Past Events
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
          </h2>
          <p className="text-muted-foreground">
            {activeTab === 'upcoming' 
              ? 'Find and purchase tickets for exciting events happening soon'
              : 'Browse our past events and their highlights'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.length > 0 ? displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all group border-0 shadow-md">
                {/* Cover Image */}
                <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${event.coverImageUrl ? '' : getEventGradient(event.id)}`}>
                  {event.coverImageUrl ? (
                    <img 
                      src={event.coverImageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarIcon className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                  <Badge 
                    variant={activeTab === 'past' ? 'secondary' : 'default'} 
                    className="absolute top-3 right-3 shadow-lg"
                  >
                    {activeTab === 'upcoming' ? 'Upcoming' : 'Past'}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="space-y-2">
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </div>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(getEventDate(event), "PPP")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {format(getEventDate(event), "p")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    {displayLocation(event)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Ticket Options</div>
                  <div className="space-y-1">
                    {event.ticketTypes.filter(tt => tt.isActive).map((ticketType, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <TicketIcon className="w-4 h-4 text-primary" />
                          {ticketType.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-primary">${Number(ticketType.price).toFixed(2)}</span>
                          <Badge variant="secondary" className="text-xs bg-muted">
                            {ticketType.quantity - ticketType.sold} left
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild className="w-full">
                    <Link href={`/live/events/${event.slug}`}>
                      View Details & Buy Tickets
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )) : (
              <Card className="border-0 shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No {activeTab} events available</h3>
              <p className="text-muted-foreground text-center">
                {activeTab === 'upcoming' 
                  ? 'Check back soon for exciting upcoming events!'
                  : 'Browse our upcoming events to stay updated!'}
              </p>
            </CardContent>
          </Card>
          )}
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
              <Link href="/onboarding/signup" className="hover:text-primary font-medium">Login</Link>
              <span>•</span>
              <span>© 2024 EventApp</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

