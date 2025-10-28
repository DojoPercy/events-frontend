"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  CalendarIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  EyeIcon,
  ArrowLeftIcon,
  PaletteIcon,
  TicketIcon,
  LayoutIcon,
  ImageIcon,
  SettingsIcon,
  ExternalLinkIcon,
  EditIcon,
  XIcon
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/image-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  venue: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  aboutSection: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean(),
})

type EventFormData = z.infer<typeof eventSchema>

interface TicketType {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  sold: number
  isActive: boolean
  requiresApproval?: boolean
}

interface TicketFormData {
  name: string
  description: string
  price: number
  quantity: number
  isActive: boolean
  requiresApproval: boolean
}

export default function EditEventPage() {
  const router = useRouter()
  const { eventId } = useParams<{ eventId: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null)
  const [ticketFormData, setTicketFormData] = useState<TicketFormData>({
    name: '',
    description: '',
    price: 0,
    quantity: 100,
    isActive: true,
    requiresApproval: false
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      primaryColor: '#D4A574',
      secondaryColor: '#ffffff',
      isPublished: false
    }
  })

  const primaryColor = watch('primaryColor')
  const secondaryColor = watch('secondaryColor')
  const logoUrl = watch('logoUrl')
  const coverImageUrl = watch('coverImageUrl')
  const title = watch('title')
  const isPublished = watch('isPublished')

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) throw new Error('Event not found')
        
        const eventData = await response.json()
        
        // Format dates for input
        const eventDate = new Date(eventData.eventDate)
        const formattedDate = format(eventDate, "yyyy-MM-dd'T'HH:mm")
        const formattedEndDate = eventData.endDate ? format(new Date(eventData.endDate), "yyyy-MM-dd'T'HH:mm") : ''
        
        reset({
          title: eventData.title,
          description: eventData.description || "",
          eventDate: formattedDate,
          endDate: formattedEndDate,
          location: eventData.location || "",
          venue: eventData.venue || "",
          logoUrl: eventData.logoUrl || "",
          coverImageUrl: eventData.coverImageUrl || "",
          primaryColor: eventData.primaryColor || '#D4A574',
          secondaryColor: eventData.secondaryColor || '#ffffff',
          heroTitle: eventData.heroTitle || "",
          heroSubtitle: eventData.heroSubtitle || "",
          aboutSection: eventData.aboutSection || "",
          website: eventData.website || "",
          linkedinUrl: eventData.linkedinUrl || "",
          twitterUrl: eventData.twitterUrl || "",
          instagramUrl: eventData.instagramUrl || "",
          isPublished: eventData.isPublished
        })
        
        setTicketTypes(eventData.ticketTypes || [])
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

  const onSubmit = async (data: EventFormData) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Event updated successfully!')
      router.push('/dashboard/events')
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update event')
    } finally {
      setSaving(false)
    }
  }

  const openAddTicketDialog = () => {
    setEditingTicket(null)
    setTicketFormData({
      name: '',
      description: '',
      price: 0,
      quantity: 100,
      isActive: true,
      requiresApproval: false
    })
    setShowTicketDialog(true)
  }

  const openEditTicketDialog = (ticket: TicketType) => {
    setEditingTicket(ticket)
    setTicketFormData({
      name: ticket.name,
      description: ticket.description || '',
      price: Number(ticket.price),
      quantity: ticket.quantity,
      isActive: ticket.isActive,
      requiresApproval: ticket.requiresApproval || false
    })
    setShowTicketDialog(true)
  }

  const handleSaveTicket = async () => {
    if (!ticketFormData.name.trim()) {
      toast.error('Ticket name is required')
      return
    }

    try {
      if (editingTicket) {
        // Update existing ticket
        const response = await fetch(`/api/events/${eventId}/ticket-types/${editingTicket.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketFormData)
        })

        if (!response.ok) throw new Error('Failed to update ticket')

        const updatedTicket = await response.json()
        setTicketTypes(prev => prev.map(t => t.id === editingTicket.id ? updatedTicket : t))
        toast.success('Ticket updated successfully')
      } else {
        // Create new ticket
        const response = await fetch(`/api/events/${eventId}/ticket-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketFormData)
        })

        if (!response.ok) throw new Error('Failed to create ticket')

        const newTicket = await response.json()
        setTicketTypes(prev => [...prev, newTicket])
        toast.success('Ticket created successfully')
      }

      setShowTicketDialog(false)
    } catch (error) {
      console.error('Error saving ticket:', error)
      toast.error('Failed to save ticket')
    }
  }

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket type?')) return

    try {
      const response = await fetch(`/api/events/${eventId}/ticket-types/${ticketId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete ticket')

      setTicketTypes(prev => prev.filter(t => t.id !== ticketId))
      toast.success('Ticket deleted successfully')
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast.error('Failed to delete ticket')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/dashboard/events')}
              className="shrink-0"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                Edit Event
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base truncate">
                {title || 'Loading...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-auto">
            <Badge variant={isPublished ? "default" : "secondary"} className="shrink-0">
              {isPublished ? "Published" : "Draft"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`/live/events/${eventId}`, '_blank')}
              className="hidden sm:flex shrink-0"
            >
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving} size="sm" className="shrink-0">
              <SaveIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
              <span className="sm:hidden">{saving ? '...' : 'Save'}</span>
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="basic" className="flex items-center text-xs sm:text-sm">
              <LayoutIcon className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center text-xs sm:text-sm">
              <ImageIcon className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center text-xs sm:text-sm">
              <PaletteIcon className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center text-xs sm:text-sm">
              <TicketIcon className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center text-xs sm:text-sm">
              <SettingsIcon className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Event Information</CardTitle>
                <CardDescription className="text-sm">Basic details about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm sm:text-base">Event Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Law Middle East Awards 2025"
                    className="text-sm sm:text-base"
                  />
                  {errors.title && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Recognising the region's legal elite..."
                    rows={5}
                    className="text-sm sm:text-base resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate" className="text-sm sm:text-base">Start Date & Time *</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      {...register("eventDate")}
                      className="text-sm sm:text-base"
                    />
                    {errors.eventDate && (
                      <p className="text-xs sm:text-sm text-destructive">{errors.eventDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm sm:text-base">End Date & Time</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      {...register("endDate")}
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue" className="text-sm sm:text-base">Venue Name</Label>
                    <Input
                      id="venue"
                      {...register("venue")}
                      placeholder="Palazzo Versace Dubai"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="Dubai, UAE"
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Event Images</CardTitle>
                <CardDescription className="text-sm">Upload images for your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Event Logo</Label>
                  <ImageUpload
                    value={logoUrl || ''}
                    onChange={(url) => setValue('logoUrl', url)}
                    label="Event Logo"
                    description="Logo for navigation and hero section (recommended: 400x400px, PNG with transparent background)"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Cover Image</Label>
                  <ImageUpload
                    value={coverImageUrl || ''}
                    onChange={(url) => setValue('coverImageUrl', url)}
                    label="Cover Image"
                    description="Hero banner for the event landing page (recommended: 1920x600px)"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Event Landing Page</CardTitle>
                <CardDescription className="text-sm">Customize how your event appears to attendees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle" className="text-sm sm:text-base">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    {...register("heroTitle")}
                    placeholder="RECOGNISING THE REGION'S LEGAL ELITE"
                    className="text-sm sm:text-base"
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to use event title</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle" className="text-sm sm:text-base">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    {...register("heroSubtitle")}
                    placeholder="Join us for an evening of excellence"
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutSection" className="text-sm sm:text-base">About Section</Label>
                  <Textarea
                    id="aboutSection"
                    {...register("aboutSection")}
                    placeholder="Additional details about the event, schedule, what to expect..."
                    rows={6}
                    className="text-sm sm:text-base resize-none"
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-4">Color Theme</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor" className="text-sm sm:text-base">Primary Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={primaryColor || '#D4A574'}
                          onChange={(e) => setValue('primaryColor', e.target.value)}
                          className="w-12 sm:w-16 h-10 cursor-pointer"
                        />
                        <Input
                          value={primaryColor || ''}
                          onChange={(e) => setValue('primaryColor', e.target.value)}
                          placeholder="#D4A574"
                          className="flex-1 font-mono text-xs sm:text-sm"
                        />
                      </div>
                      <div
                        className="h-10 sm:h-12 rounded-lg border shadow-sm"
                        style={{ backgroundColor: primaryColor || '#D4A574' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor" className="text-sm sm:text-base">Secondary Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor || '#ffffff'}
                          onChange={(e) => setValue('secondaryColor', e.target.value)}
                          className="w-12 sm:w-16 h-10 cursor-pointer"
                        />
                        <Input
                          value={secondaryColor || ''}
                          onChange={(e) => setValue('secondaryColor', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 font-mono text-xs sm:text-sm"
                        />
                      </div>
                      <div
                        className="h-10 sm:h-12 rounded-lg border shadow-sm"
                        style={{ backgroundColor: secondaryColor || '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-4">Social Media Links</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm sm:text-base">Event Website</Label>
                      <Input
                        id="website"
                        {...register("website")}
                        placeholder="https://example.com"
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl" className="text-sm sm:text-base">LinkedIn</Label>
                      <Input
                        id="linkedinUrl"
                        {...register("linkedinUrl")}
                        placeholder="https://linkedin.com/company/..."
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl" className="text-sm sm:text-base">Twitter/X</Label>
                      <Input
                        id="twitterUrl"
                        {...register("twitterUrl")}
                        placeholder="https://twitter.com/..."
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagramUrl" className="text-sm sm:text-base">Instagram</Label>
                      <Input
                        id="instagramUrl"
                        {...register("instagramUrl")}
                        placeholder="https://instagram.com/..."
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Ticket Types</CardTitle>
                    <CardDescription className="text-sm">Manage your event ticket tiers</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openAddTicketDialog}
                    className="self-start sm:self-auto"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ticketTypes.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <TicketIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-base sm:text-lg font-semibold">No tickets yet</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                      Create ticket types to start accepting registrations
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openAddTicketDialog}
                      className="mt-4"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add First Ticket
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {ticketTypes.map((ticket) => (
                      <Card key={ticket.id} className="overflow-hidden">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-base sm:text-lg font-semibold truncate">{ticket.name}</h3>
                                <Badge variant={ticket.isActive ? "default" : "secondary"} className="text-xs shrink-0">
                                  {ticket.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {ticket.requiresApproval && (
                                  <Badge variant="outline" className="text-xs shrink-0">Requires Approval</Badge>
                                )}
                              </div>
                              {ticket.description && (
                                <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {ticket.description}
                                </p>
                              )}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                                <div>
                                  <p className="text-muted-foreground">Price</p>
                                  <p className="font-semibold truncate">${Number(ticket.price).toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total</p>
                                  <p className="font-semibold">{ticket.quantity}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Sold</p>
                                  <p className="font-semibold">{ticket.sold}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Available</p>
                                  <p className="font-semibold">{ticket.quantity - ticket.sold}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex sm:flex-col gap-2 self-end sm:self-start">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => openEditTicketDialog(ticket)}
                              >
                                <EditIcon className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteTicket(ticket.id)}
                                disabled={ticket.sold > 0}
                              >
                                <TrashIcon className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Publishing</CardTitle>
                <CardDescription className="text-sm">Control event visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm sm:text-base">Publish Event</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Make this event visible to the public
                    </p>
                  </div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={(checked) => setValue('isPublished', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-destructive">Danger Zone</CardTitle>
                <CardDescription className="text-sm">Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" disabled>
                  Delete Event (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t mt-4 sm:mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/events')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} size="sm">
              <SaveIcon className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>

      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingTicket ? 'Edit Ticket Type' : 'Add Ticket Type'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingTicket ? 'Update ticket details' : 'Create a new ticket tier for your event'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticketName" className="text-sm sm:text-base">Ticket Name *</Label>
              <Input
                id="ticketName"
                value={ticketFormData.name}
                onChange={(e) => setTicketFormData({ ...ticketFormData, name: e.target.value })}
                placeholder="e.g., VIP, Early Bird, General Admission"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketDescription" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="ticketDescription"
                value={ticketFormData.description}
                onChange={(e) => setTicketFormData({ ...ticketFormData, description: e.target.value })}
                placeholder="Optional description of what's included"
                rows={3}
                className="text-sm sm:text-base resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketPrice" className="text-sm sm:text-base">Price *</Label>
                <Input
                  id="ticketPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={ticketFormData.price}
                  onChange={(e) => setTicketFormData({ ...ticketFormData, price: parseFloat(e.target.value) || 0 })}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketQuantity" className="text-sm sm:text-base">Quantity *</Label>
                <Input
                  id="ticketQuantity"
                  type="number"
                  min={editingTicket?.sold || 0}
                  value={ticketFormData.quantity}
                  onChange={(e) => setTicketFormData({ ...ticketFormData, quantity: parseInt(e.target.value) || 0 })}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-sm sm:text-base">Active</Label>
                <p className="text-xs text-muted-foreground">Available for purchase</p>
              </div>
              <Switch
                checked={ticketFormData.isActive}
                onCheckedChange={(checked) => setTicketFormData({ ...ticketFormData, isActive: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-sm sm:text-base">Requires Approval</Label>
                <p className="text-xs text-muted-foreground">Manual approval needed</p>
              </div>
              <Switch
                checked={ticketFormData.requiresApproval}
                onCheckedChange={(checked) => setTicketFormData({ ...ticketFormData, requiresApproval: checked })}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTicketDialog(false)}
              className="w-full sm:w-auto"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveTicket}
              className="w-full sm:w-auto"
              size="sm"
            >
              {editingTicket ? 'Update Ticket' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
