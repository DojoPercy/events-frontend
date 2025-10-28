"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PlusIcon, CalendarIcon, EditIcon, TrashIcon, MapPinIcon, TicketIcon, UsersIcon } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/spinner"
import { toast } from "sonner"

interface TicketType {
  name: string
  price: number
  quantity: number
  sold: number
}

interface Event {
  id: string
  title: string
  description?: string
  slug: string
  eventDate: Date | string
  endDate?: Date | string
  location?: string
  venue?: string
  isPublished: boolean
  createdAt: Date | string
  ticketTypes: TicketType[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const response = await fetch('/api/events')
        
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please log in to view events')
            setError('Unauthorized')
            return
          }
          throw new Error('Failed to fetch events')
        }

        const data = await response.json()
        setEvents(data)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(err instanceof Error ? err.message : 'Failed to load events')
        toast.error('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">
              Manage your events and ticket types
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/events/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Events
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your events and ticket types
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/dashboard/events/create">
            <PlusIcon className="h-5 w-5" />
            Create Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first event to start selling tickets
            </p>
            <Button asChild>
              <Link href="/dashboard/events/create">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event, index) => {
            const eventDate = typeof event.eventDate === 'string' 
              ? new Date(event.eventDate) 
              : event.eventDate
            const displayLocation = event.venue || event.location || "Location TBD"

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={event.isPublished ? "default" : "secondary"} className="shadow-sm">
                          {event.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                            <Link href={`/dashboard/events/${event.id}/edit`}>
                              <EditIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(eventDate, "PPP")}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        {displayLocation}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Ticket Types</div>
                      <div className="space-y-1">
                        {event.ticketTypes && event.ticketTypes.length > 0 ? (
                          event.ticketTypes.map((ticketType, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{ticketType.name}</span>
                              <span className="text-muted-foreground">
                                ${ticketType.price} • {ticketType.sold}/{ticketType.quantity} sold
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No ticket types configured
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
