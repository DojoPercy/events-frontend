"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, MapPinIcon, PlusIcon, TrashIcon, SaveIcon } from "lucide-react"
import { format } from "date-fns"

import { updateEventSchema, createTicketTypeSchema, type UpdateEventInput, type CreateTicketTypeInput } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SubmitButton } from "@/components/submit-button"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string
  slug: string
  eventDate: string
  location: string
  isPublished: boolean
  ticketTypes: Array<{
    id: string
    name: string
    description: string
    price: number
    quantity: number
    sold: number
  }>
}

export default function EditEventPage() {
  const router = useRouter()
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [newTicketTypes, setNewTicketTypes] = useState<CreateTicketTypeInput[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema)
  })

  const isPublished = watch("isPublished")

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) {
          throw new Error('Event not found')
        }
        const eventData = await response.json()
        setEvent(eventData)
        
        // Format date for input
        const eventDate = new Date(eventData.eventDate)
        const formattedDate = format(eventDate, "yyyy-MM-dd'T'HH:mm")
        
        reset({
          title: eventData.title,
          description: eventData.description || "",
          eventDate: formattedDate,
          location: eventData.location || "",
          isPublished: eventData.isPublished
        })
      } catch (error) {
        console.error('Error fetching event:', error)
        toast.error('Failed to load event')
        router.push('/dashboard/events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId, reset, router])

  const addTicketType = () => {
    setNewTicketTypes([...newTicketTypes, { name: "", description: "", price: 0, quantity: 0 }])
  }

  const removeTicketType = (index: number) => {
    setNewTicketTypes(newTicketTypes.filter((_, i) => i !== index))
  }

  const updateTicketType = (index: number, field: keyof CreateTicketTypeInput, value: any) => {
    const updated = [...newTicketTypes]
    updated[index] = { ...updated[index], [field]: value }
    setNewTicketTypes(updated)
  }

  const onSubmit = async (data: UpdateEventInput) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update event')
      }

      toast.success('Event updated successfully!')
      router.push('/dashboard/events')
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update event')
    }
  }

  const deleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      toast.success('Event deleted successfully!')
      router.push('/dashboard/events')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Button onClick={() => router.push('/dashboard/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <Button
          variant="destructive"
          onClick={deleteEvent}
          className="flex items-center gap-2"
        >
          <TrashIcon className="h-4 w-4" />
          Delete Event
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Update the basic information for your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter event description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="eventDate">Event Date & Time</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                {...register("eventDate")}
              />
              {errors.eventDate && (
                <p className="text-sm text-red-600 mt-1">{errors.eventDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Enter event location"
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={isPublished}
                onCheckedChange={(checked) => setValue("isPublished", checked)}
              />
              <Label htmlFor="isPublished">Publish Event</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Types</CardTitle>
            <CardDescription>
              Manage the different types of tickets for this event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.ticketTypes.map((ticketType) => (
              <div key={ticketType.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={ticketType.name} disabled />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input value={`$${ticketType.price}`} disabled />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input value={ticketType.quantity} disabled />
                  </div>
                  <div>
                    <Label>Sold</Label>
                    <Input value={ticketType.sold} disabled />
                  </div>
                </div>
              </div>
            ))}

            {newTicketTypes.map((ticketType, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={ticketType.name}
                      onChange={(e) => updateTicketType(index, "name", e.target.value)}
                      placeholder="Ticket type name"
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={ticketType.price}
                      onChange={(e) => updateTicketType(index, "price", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={ticketType.quantity}
                      onChange={(e) => updateTicketType(index, "quantity", parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeTicketType(index)}
                      className="flex items-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addTicketType}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Ticket Type
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/events')}
          >
            Cancel
          </Button>
          <SubmitButton className="flex items-center gap-2">
            <SaveIcon className="h-4 w-4" />
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}

