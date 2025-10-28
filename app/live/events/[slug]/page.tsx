"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, MapPinIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description?: string
  slug: string
  eventDate: string | Date
  endDate?: string | Date
  location?: string
  venue?: string
  addressLine1?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  latitude?: number
  longitude?: number
  coverImageUrl?: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  heroTitle?: string
  heroSubtitle?: string
  aboutSection?: string
  website?: string
  linkedinUrl?: string
  twitterUrl?: string
  instagramUrl?: string
  currency?: string
  taxRate?: number
  taxName?: string
  isPublished: boolean
  ticketTypes: Array<{
    id: string
    name: string
    description?: string
    price: number
    quantity: number
    sold: number
    isActive: boolean
    requiresApproval?: boolean
  }>
  organization?: {
    name: string
  }
}

interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { slug } = await params
        const response = await fetch(`/api/events/public/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Event not found')
          } else {
            throw new Error('Failed to fetch event')
          }
          router.push('/live/events')
          return
        }

        const eventData = await response.json()
        setEvent(eventData)
      } catch (error) {
        console.error('Error fetching event:', error)
        toast.error('Failed to load event')
        router.push('/live/events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params, router])

  // Countdown timer
  useEffect(() => {
    if (!event) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const eventTime = new Date(event.eventDate).getTime()
      const distance = eventTime - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [event])

  const primaryColor = event?.primaryColor || "#D4A574"
  const secondaryColor = event?.secondaryColor || "#ffffff"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Event not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{
      '--primary-color': primaryColor,
      '--secondary-color': secondaryColor,
    } as React.CSSProperties}>
      
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {event.logoUrl && (
              <img src={event.logoUrl} alt="Event Logo" className="h-12" />
            )}
            <nav className="flex items-center space-x-6">
              <a href="#about" className="hover:text-gray-600">About</a>
              <a href="#tickets" className="hover:text-gray-600">Tickets</a>
              <a href="#venue" className="hover:text-gray-600">Venue</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Background */}
      <section 
        className="relative h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${event.coverImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-6 text-center space-y-8">
          {/* Logo */}
          {event.logoUrl && (
            <div className="mb-4">
              <img src={event.logoUrl} alt="Event Logo" className="h-32 mx-auto" />
            </div>
          )}

          {/* Event Details */}
          <div className="flex items-center justify-center space-x-6 text-lg">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {format(new Date(event.eventDate), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="mr-2 h-5 w-5" />
              {event.venue || event.location}
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl font-bold">
            {event.heroTitle || event.title}
          </h1>
          {event.heroSubtitle && (
            <p className="text-2xl text-gray-300">
              {event.heroSubtitle}
            </p>
          )}

          {/* Countdown Timer */}
          <div className="flex items-center justify-center space-x-4 mt-12">
            <CountdownBox label="Days" value={countdown.days} primaryColor={primaryColor} />
            <CountdownBox label="Hours" value={countdown.hours} primaryColor={primaryColor} />
            <CountdownBox label="Minutes" value={countdown.minutes} primaryColor={primaryColor} />
            <CountdownBox label="Seconds" value={countdown.seconds} primaryColor={primaryColor} />
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Button
              size="lg"
              className="px-12 py-6 text-lg"
              style={{ backgroundColor: primaryColor, color: secondaryColor }}
              onClick={() => {
                params.then(({ slug }) => router.push(`/live/events/${slug}/tickets`))
              }}
            >
              BOOK NOW
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20" style={{ backgroundColor: secondaryColor }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold" style={{ color: primaryColor }}>
              {event.heroTitle || event.title}
            </h2>
            {event.heroSubtitle && (
              <p className="text-2xl text-gray-600">{event.heroSubtitle}</p>
            )}
            <div className="prose max-w-none text-gray-700">
              {event.description && (
                <p className="text-lg leading-relaxed">{event.description}</p>
              )}
              {event.aboutSection && (
                <div dangerouslySetInnerHTML={{ __html: event.aboutSection }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tickets Preview */}
      <section id="tickets" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: primaryColor }}>
            TICKETS NOW ON SALE
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {event.ticketTypes.filter(tt => tt.isActive).map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-lg p-6 border-t-4" style={{ borderTopColor: primaryColor }}>
                <h3 className="text-2xl font-bold mb-2">{ticket.name}</h3>
                {ticket.requiresApproval && (
                  <Badge className="bg-yellow-400 text-black mb-4">Approval required</Badge>
                )}
                <div className="text-3xl font-bold my-4" style={{ color: primaryColor }}>
                  {event.currency} {Number(ticket.price).toFixed(2)}
                </div>
                {ticket.description && (
                  <p className="text-gray-600 mb-4">{ticket.description}</p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  {ticket.quantity - ticket.sold} available
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: primaryColor, color: secondaryColor }}
                  onClick={() => {
                    params.then(({ slug }) => router.push(`/live/events/${slug}/tickets`))
                  }}
                >
                  BOOK NOW
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">{event.venue || 'Event Venue'}</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="space-y-3 text-gray-700">
              {event.addressLine1 && <p className="flex items-start">
                <MapPinIcon className="mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{event.addressLine1}</span>
              </p>}
              {event.city && event.state && (
                <p className="ml-8">{event.city}, {event.state}</p>
              )}
              {event.country && <p className="ml-8 font-semibold">{event.country}</p>}
              {event.zipCode && <p className="ml-8">{event.zipCode}</p>}
              
              {(event.venue || event.city) && (
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const address = `${event.venue || ''}, ${event.city || ''}, ${event.country || ''}`.trim()
                      window.open(`https://maps.google.com?q=${encodeURIComponent(address)}`, '_blank')
                    }}
                    aria-label="Get directions to venue"
                  >
                    Get Directions on Google Maps
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4">
            <div>
              <p className="text-sm text-gray-400">
                © 2024 {event.organization?.name || 'EventApp'}. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {event.linkedinUrl && (
                <a href={event.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                  <LinkedinIcon className="h-6 w-6" />
                </a>
              )}
              {event.twitterUrl && (
                <a href={event.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter profile">
                  <TwitterIcon className="h-6 w-6" />
                </a>
              )}
              {event.instagramUrl && (
                <a href={event.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">
                  <InstagramIcon className="h-6 w-6" />
                </a>
              )}
              {event.website && (
                <a href={event.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CountdownBox({ label, value, primaryColor }: { label: string; value: number; primaryColor: string }) {
  return (
    <div className="text-center">
      <div 
        className="w-24 h-24 border-2 rounded-lg flex items-center justify-center text-4xl font-bold mb-2"
        style={{ borderColor: primaryColor }}
      >
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-sm uppercase">{label}</div>
    </div>
  )
}
