"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PlusIcon, CalendarIcon, EditIcon, TrashIcon, MapPinIcon, TicketIcon, EyeIcon, ExternalLinkIcon, MoreHorizontalIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/spinner"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  isDraft: boolean
  createdAt: Date | string
  ticketTypes: TicketType[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

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

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete event')

      setEvents(events.filter(e => e.id !== eventId))
      toast.success('Event deleted successfully')
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  const openDetails = (event: Event) => {
    setSelectedEvent(event)
    setDetailsOpen(true)
  }

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">
              Manage your events and ticket types
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/events/create">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Events
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Manage your events and ticket types
          </p>
        </div>
        <Button asChild size="default" className="gap-2 w-full sm:w-auto">
          <Link href="/dashboard/events/create">
            <PlusIcon className="h-4 w-4" />
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
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const eventDate = typeof event.eventDate === 'string' 
                    ? new Date(event.eventDate) 
                    : event.eventDate
                  const totalSold = event.ticketTypes?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0
                  const totalCapacity = event.ticketTypes?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0

                  return (
                    <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(event)}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold">{event.title}</span>
                          {event.description && (
                            <span className="text-sm text-muted-foreground line-clamp-1">
                              {event.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {format(eventDate, "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">
                            {event.venue || event.location || "TBD"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TicketIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {totalSold}/{totalCapacity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.isPublished ? "default" : "secondary"}>
                          {event.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation()
                              openDetails(event)
                            }}>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/events/${event.id}/edit`} onClick={(e) => e.stopPropagation()}>
                                <EditIcon className="mr-2 h-4 w-4" />
                                Edit Event
                              </Link>
                            </DropdownMenuItem>
                            {event.isPublished && (
                              <DropdownMenuItem asChild>
                                <Link href={`/live/events/${event.slug}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                                  <ExternalLinkIcon className="mr-2 h-4 w-4" />
                                  View Public Page
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(event.id)
                              }}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {events.map((event) => {
              const eventDate = typeof event.eventDate === 'string' 
                ? new Date(event.eventDate) 
                : event.eventDate
              const totalSold = event.ticketTypes?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0
              const totalCapacity = event.ticketTypes?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0

              return (
                <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetails(event)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                        )}
                      </div>
                      <Badge variant={event.isPublished ? "default" : "secondary"} className="ml-2">
                        {event.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {format(eventDate, "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="truncate">{event.venue || event.location || "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TicketIcon className="h-4 w-4" />
                        {totalSold}/{totalCapacity} tickets sold
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild className="flex-1" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/dashboard/events/${event.id}/edit`}>
                          <EditIcon className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation()
                        openDetails(event)
                      }}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.description || "No description provided"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Event Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Event Date</h4>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(typeof selectedEvent.eventDate === 'string' ? new Date(selectedEvent.eventDate) : selectedEvent.eventDate, "PPP 'at' p")}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      {selectedEvent.venue || selectedEvent.location || "Location TBD"}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Status</h4>
                    <Badge variant={selectedEvent.isPublished ? "default" : "secondary"}>
                      {selectedEvent.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Event Slug</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{selectedEvent.slug}</code>
                  </div>
                </div>

                {/* Ticket Types */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Ticket Types</h4>
                  {selectedEvent.ticketTypes && selectedEvent.ticketTypes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEvent.ticketTypes.map((ticket, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${ticket.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {ticket.sold || 0} / {ticket.quantity}
                            </p>
                            <p className="text-xs text-muted-foreground">sold</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No ticket types configured</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                  <Button asChild className="flex-1">
                    <Link href={`/dashboard/events/${selectedEvent.id}/edit`}>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit Event
                    </Link>
                  </Button>
                  {selectedEvent.isPublished && (
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/live/events/${selectedEvent.slug}`} target="_blank">
                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                        View Public Page
                      </Link>
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      setDetailsOpen(false)
                      handleDelete(selectedEvent.id)
                    }}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
