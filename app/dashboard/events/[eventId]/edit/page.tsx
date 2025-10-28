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
  ExternalLinkIcon
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
}

export default function EditEventPage() {
  const router = useRouter()
  const { eventId } = useParams<{ eventId: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [showPreview, setShowPreview] = useState(false)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/events')}>
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
              <p className="text-muted-foreground mt-1">{title || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Published" : "Draft"}
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => window.open(`/live/events/${eventId}`, '_blank')}
              className="hidden sm:flex"
            >
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
              <SaveIcon className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="basic" className="flex items-center">
              <LayoutIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Basic Info</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Images</span>
              <span className="sm:hidden">Images</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center">
              <PaletteIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Design</span>
              <span className="sm:hidden">Design</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center">
              <TicketIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Tickets</span>
              <span className="sm:hidden">Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
                <CardDescription>Basic details about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Law Middle East Awards 2025"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Recognising the region's legal elite..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Start Date & Time *</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      {...register("eventDate")}
                    />
                    {errors.eventDate && (
                      <p className="text-sm text-destructive">{errors.eventDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date & Time</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      {...register("endDate")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue Name</Label>
                    <Input
                      id="venue"
                      {...register("venue")}
                      placeholder="Palazzo Versace Dubai"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="Dubai, UAE"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Images</CardTitle>
                <CardDescription>Upload images for your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Event Logo</Label>
                  <ImageUpload
                    value={logoUrl || ''}
                    onChange={(url) => setValue('logoUrl', url)}
                    label="Event Logo"
                    description="Logo for navigation and hero section (recommended: 400x400px, PNG with transparent background)"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Cover Image</Label>
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
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Landing Page</CardTitle>
                <CardDescription>Customize how your event appears to attendees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    {...register("heroTitle")}
                    placeholder="RECOGNISING THE REGION'S LEGAL ELITE"
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to use event title</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    {...register("heroSubtitle")}
                    placeholder="Join us for an evening of excellence"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutSection">About Section</Label>
                  <Textarea
                    id="aboutSection"
                    {...register("aboutSection")}
                    placeholder="Additional details about the event, schedule, what to expect..."
                    rows={6}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-4">Color Theme</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={primaryColor || '#D4A574'}
                          onChange={(e) => setValue('primaryColor', e.target.value)}
                          className="w-16 h-10 cursor-pointer"
                        />
                        <Input
                          value={primaryColor || ''}
                          onChange={(e) => setValue('primaryColor', e.target.value)}
                          placeholder="#D4A574"
                          className="flex-1 font-mono"
                        />
                      </div>
                      <div
                        className="h-12 rounded-lg border shadow-sm"
                        style={{ backgroundColor: primaryColor || '#D4A574' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor || '#ffffff'}
                          onChange={(e) => setValue('secondaryColor', e.target.value)}
                          className="w-16 h-10 cursor-pointer"
                        />
                        <Input
                          value={secondaryColor || ''}
                          onChange={(e) => setValue('secondaryColor', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 font-mono"
                        />
                      </div>
                      <div
                        className="h-12 rounded-lg border shadow-sm"
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
                      <Label htmlFor="website">Event Website</Label>
                      <Input
                        id="website"
                        {...register("website")}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn</Label>
                      <Input
                        id="linkedinUrl"
                        {...register("linkedinUrl")}
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">Twitter/X</Label>
                      <Input
                        id="twitterUrl"
                        {...register("twitterUrl")}
                        placeholder="https://twitter.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagramUrl">Instagram</Label>
                      <Input
                        id="instagramUrl"
                        {...register("instagramUrl")}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ticket Types</CardTitle>
                    <CardDescription>Manage your event ticket tiers</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/events/${eventId}/edit#tickets`)}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ticketTypes.length === 0 ? (
                  <div className="text-center py-12">
                    <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No tickets yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create ticket types to start accepting registrations
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ticketTypes.map((ticket) => (
                      <Card key={ticket.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold">{ticket.name}</h3>
                                <Badge variant={ticket.isActive ? "default" : "secondary"}>
                                  {ticket.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              {ticket.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {ticket.description}
                                </p>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Price</p>
                                  <p className="font-semibold">${Number(ticket.price).toFixed(2)}</p>
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
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>Control event visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Publish Event</Label>
                    <p className="text-sm text-muted-foreground">
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
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" disabled>
                  Delete Event (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/events')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <SaveIcon className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
