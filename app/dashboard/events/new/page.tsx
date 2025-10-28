"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, MapPinIcon, PlusIcon, TrashIcon } from "lucide-react"
import { format } from "date-fns"

import { createEventSchema, createTicketTypeSchema, type CreateEventInput, type CreateTicketTypeInput } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "sonner"

export default function CreateEventPage() {
  const router = useRouter()
  
  // Redirect to new wizard
  useEffect(() => {
    router.push('/dashboard/events/create')
  }, [router])
  
  return null
  
  const [ticketTypes, setTicketTypes] = useState<CreateTicketTypeInput[]>([
    { name: "", description: "", price: 0, quantity: 0 }
  ])
  const [imageUrl, setImageUrl] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      eventDate: "",
      location: "",
      isPublished: false
    }
  })

  const isPublished = watch("isPublished")

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", description: "", price: 0, quantity: 0 }])
  }

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index))
    }
  }

  const updateTicketType = (index: number, field: keyof CreateTicketTypeInput, value: any) => {
    const updated = [...ticketTypes]
    updated[index] = { ...updated[index], [field]: value }
    setTicketTypes(updated)
  }

  const onSubmit = async (data: CreateEventInput) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imageUrl,
          ticketTypes: ticketTypes.filter(tt => tt.name && tt.price > 0 && tt.quantity > 0)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const event = await response.json()
      toast.success('Event created successfully!')
      router.push(`/dashboard/events/${event.id}/edit`)
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground">
          Set up your event details and ticket types
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Basic information about your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your event"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                label="Event Image"
                description="Upload an image for your event (optional)"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="datetime-local"
                  {...register("eventDate")}
                />
                {errors.eventDate && (
                  <p className="text-sm text-red-500">{errors.eventDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Event location"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={isPublished}
                onCheckedChange={(checked) => setValue("isPublished", checked)}
              />
              <Label htmlFor="isPublished">Publish event (make it visible to public)</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ticket Types</CardTitle>
                <CardDescription>
                  Define different ticket options for your event
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addTicketType}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Ticket Type
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticketTypes.map((ticketType, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Ticket Type {index + 1}</h4>
                    {ticketTypes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTicketType(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`ticket-name-${index}`}>Name *</Label>
                      <Input
                        id={`ticket-name-${index}`}
                        value={ticketType.name}
                        onChange={(e) => updateTicketType(index, "name", e.target.value)}
                        placeholder="e.g., Early Bird, VIP, General"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ticket-price-${index}`}>Price ($) *</Label>
                      <Input
                        id={`ticket-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={ticketType.price}
                        onChange={(e) => updateTicketType(index, "price", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ticket-quantity-${index}`}>Quantity *</Label>
                      <Input
                        id={`ticket-quantity-${index}`}
                        type="number"
                        min="1"
                        value={ticketType.quantity}
                        onChange={(e) => updateTicketType(index, "quantity", parseInt(e.target.value) || 0)}
                        placeholder="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ticket-description-${index}`}>Description</Label>
                      <Input
                        id={`ticket-description-${index}`}
                        value={ticketType.description}
                        onChange={(e) => updateTicketType(index, "description", e.target.value)}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </div>
  )
}
