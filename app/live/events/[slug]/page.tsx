"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, MapPinIcon, LinkedinIcon, TwitterIcon, InstagramIcon, GlobeIcon, MenuIcon, XIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
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
    customNotes?: string
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedTickets, setExpandedTickets] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { slug } = await params
        console.log('[EVENT PAGE] Fetching event with slug:', slug)
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
        console.log('[EVENT PAGE] Event data received:', {
          id: eventData.id,
          title: eventData.title,
          hasLogoUrl: !!eventData.logoUrl,
          logoUrl: eventData.logoUrl,
          hasCoverImageUrl: !!eventData.coverImageUrl,
          coverImageUrl: eventData.coverImageUrl
        })
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
  const currency = event?.currency || "AED"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading event...</div>
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
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {event.logoUrl ? (
                <img 
                  src={event.logoUrl} 
                  alt="Event Logo" 
                  className="h-8 sm:h-12 object-contain"
                  onError={(e) => {
                    console.error('[EVENT PAGE] Logo failed to load:', event.logoUrl)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="h-8 sm:h-12 flex items-center">
                  <span className="font-bold text-lg sm:text-xl" style={{ color: primaryColor }}>
                    {event.title}
                  </span>
                </div>
              )}
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#about" className="hover:text-gray-600 transition-colors">About</a>
              <a href="#tickets" className="hover:text-gray-600 transition-colors">Tickets</a>
              <a href="#venue" className="hover:text-gray-600 transition-colors">Venue</a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-3 border-t pt-4">
              <a 
                href="#about" 
                className="hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#tickets" 
                className="hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tickets
              </a>
              <a 
                href="#venue" 
                className="hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Venue
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section with Background */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-white pt-16 sm:pt-0"
        style={{
          backgroundImage: event.coverImageUrl 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${event.coverImageUrl})`
            : `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 py-12 sm:py-0">
          {/* Logo */}
          {event.logoUrl && (
            <div className="mb-4">
              <img 
                src={event.logoUrl} 
                alt="Event Logo" 
                className="h-24 sm:h-32 mx-auto object-contain"
                onError={(e) => {
                  console.error('[EVENT PAGE] Hero logo failed to load:', event.logoUrl)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Event Details */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-6 space-y-3 sm:space-y-0 text-base sm:text-lg">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>{format(new Date(event.eventDate), 'MMMM dd, yyyy')}</span>
            </div>
            {event.location && (
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight px-4">
            {event.heroTitle || event.title}
          </h1>

          {/* Subtitle */}
          {event.heroSubtitle && (
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto px-4">
              {event.heroSubtitle}
            </p>
          )}

          {/* Countdown */}
          {countdown.days > 0 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mt-8 sm:mt-12 px-4">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds }
              ].map((item) => (
                <div key={item.label} className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                  <div className="text-2xl sm:text-4xl font-bold">{item.value}</div>
                  <div className="text-xs sm:text-sm opacity-90">{item.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-6 sm:pt-8">
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
              style={{ 
                backgroundColor: primaryColor,
                color: secondaryColor 
              }}
              onClick={() => router.push(`/live/events/${event.slug}/tickets`)}
            >
              Get Your Tickets
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center" style={{ color: primaryColor }}>
            About the Event
          </h2>
          
          {event.description && (
            <div className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          )}

          {event.aboutSection && (
            <div className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.aboutSection}
            </div>
          )}

          {!event.description && !event.aboutSection && (
            <p className="text-center text-gray-500 italic">No description available</p>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" style={{ color: primaryColor }} />
                Date & Time
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {format(new Date(event.eventDate), 'EEEE, MMMM dd, yyyy')}
              </p>
              <p className="text-sm sm:text-base text-gray-700">
                {format(new Date(event.eventDate), 'h:mm a')}
                {event.endDate && ` - ${format(new Date(event.endDate), 'h:mm a')}`}
              </p>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" style={{ color: primaryColor }} />
                Location
              </h3>
              {event.venue && <p className="text-sm sm:text-base font-medium text-gray-900">{event.venue}</p>}
              {event.addressLine1 && <p className="text-sm sm:text-base text-gray-700">{event.addressLine1}</p>}
              {event.city && (
                <p className="text-sm sm:text-base text-gray-700">
                  {event.city}{event.state && `, ${event.state}`} {event.zipCode}
                </p>
              )}
              {event.country && <p className="text-sm sm:text-base text-gray-700">{event.country}</p>}
            </div>
          </div>

          {/* Organizer */}
          {event.organization && (
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-sm sm:text-base text-gray-600">Organized by</p>
              <p className="text-lg sm:text-xl font-semibold mt-2" style={{ color: primaryColor }}>
                {event.organization.name}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Tickets Section */}
      <section id="tickets" className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center" style={{ color: primaryColor }}>
            Ticket Options
          </h2>

          {event.ticketTypes.length > 0 ? (
            <>
              {/* Desktop: 3 columns grid */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
                {event.ticketTypes.filter(t => t.isActive).map((ticket) => {
                  const available = ticket.quantity - ticket.sold
                  const isSoldOut = available <= 0
                  const showMore = expandedTickets[ticket.id] || false

                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Header with decorative tickets */}
                      <div className="relative px-6 py-16 overflow-hidden" style={{ backgroundColor: primaryColor }}>
                        {/* Decorative ticket outline */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20">
                          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="38" height="22" rx="2" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" />
                            <circle cx="5" cy="12" r="2" stroke="white" strokeWidth="1" fill="none" />
                            <circle cx="35" cy="12" r="2" stroke="white" strokeWidth="1" fill="none" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white pr-12 line-clamp-2">{ticket.name}</h3>
                      </div>

                      {/* Price Section */}
                      <div className="px-6 py-5 bg-white">
                        <div className="text-3xl font-bold text-gray-900">
                          {currency || 'AED'} {Number(ticket.price).toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Sales end on {format(new Date(event.eventDate), "MMM dd, yyyy")}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <div className="px-6 pb-4">
                        <Button
                          className="w-full text-white font-semibold py-6 rounded-lg transition-all"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => router.push(`/live/events/${event.slug}/tickets`)}
                          disabled={isSoldOut}
                        >
                          {isSoldOut ? 'SOLD OUT' : 'BOOK NOW'}
                        </Button>
                        {ticket.requiresApproval && (
                          <p className="text-xs text-red-600 mt-2 flex items-center justify-center gap-1">
                            <span className="text-red-600">*</span> Approval Required
                          </p>
                        )}
                      </div>

                      {/* Details Section */}
                      <div className="px-6 pb-6 flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">More Details</h4>
                        {ticket.description && (
                          <p className={cn(
                            "text-sm text-gray-600 leading-relaxed",
                            !showMore && "line-clamp-3"
                          )}>
                            {ticket.description}
                          </p>
                        )}
                        {ticket.customNotes && (
                          <p className={cn(
                            "text-xs text-gray-500 mt-2 italic",
                            !showMore && "line-clamp-2"
                          )}>
                            {ticket.customNotes}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Subject to 5% VAT.</p>
                        {(ticket.description || ticket.customNotes) && (
                          <button
                            onClick={() => setExpandedTickets(prev => ({ ...prev, [ticket.id]: !showMore }))}
                            className="text-xs mt-2 hover:underline"
                            style={{ color: primaryColor }}
                          >
                            {showMore ? '... Show less' : '... Show more'}
                          </button>
                        )}
                        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                          {available} / {ticket.quantity} tickets available
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile & Tablet: Horizontal scroll */}
              <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
                <div className="flex gap-4 min-w-min">
                  {event.ticketTypes.filter(t => t.isActive).map((ticket) => {
                    const available = ticket.quantity - ticket.sold
                    const isSoldOut = available <= 0
                    const showMore = expandedTickets[ticket.id] || false

                    return (
                      <div
                        key={ticket.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden w-[320px] sm:w-[400px] flex-shrink-0 snap-center flex flex-col"
                      >
                        {/* Header */}
                        <div className="relative px-6 py-4 overflow-hidden" style={{ backgroundColor: primaryColor }}>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20">
                            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="1" y="1" width="38" height="22" rx="2" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" />
                              <circle cx="5" cy="12" r="2" stroke="white" strokeWidth="1" fill="none" />
                              <circle cx="35" cy="12" r="2" stroke="white" strokeWidth="1" fill="none" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-white pr-12">{ticket.name}</h3>
                        </div>

                        {/* Price */}
                        <div className="px-6 py-5">
                          <div className="text-3xl font-bold text-gray-900">
                            {currency || 'AED'} {Number(ticket.price).toFixed(2)}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Sales end on {format(new Date(event.eventDate), "MMM dd, yyyy")}
                          </p>
                        </div>

                        {/* CTA */}
                        <div className="px-6 pb-4">
                          <Button
                            className="w-full text-white font-semibold py-6 rounded-lg"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => router.push(`/live/events/${event.slug}/tickets`)}
                            disabled={isSoldOut}
                          >
                            {isSoldOut ? 'SOLD OUT' : 'BOOK NOW'}
                          </Button>
                          {ticket.requiresApproval && (
                            <p className="text-xs text-red-600 mt-2 flex items-center justify-center gap-1">
                              <span>*</span> Approval Required
                            </p>
                          )}
                        </div>

                        {/* Details */}
                        <div className="px-6 pb-6 flex-1">
                          <h4 className="font-bold text-gray-900 mb-2">More Details</h4>
                          {ticket.description && (
                            <p className={cn("text-sm text-gray-600", !showMore && "line-clamp-3")}>
                              {ticket.description}
                            </p>
                          )}
                          {ticket.customNotes && (
                            <p className={cn("text-xs text-gray-500 mt-2 italic", !showMore && "line-clamp-2")}>
                              {ticket.customNotes}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">Subject to 5% VAT.</p>
                          {(ticket.description || ticket.customNotes) && (
                            <button
                              onClick={() => setExpandedTickets(prev => ({ ...prev, [ticket.id]: !showMore }))}
                              className="text-xs mt-2 hover:underline"
                              style={{ color: primaryColor }}
                            >
                              {showMore ? '... Show less' : '... Show more'}
                            </button>
                          )}
                          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                            {available} / {ticket.quantity} available
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Scroll indicator for mobile */}
              <div className="lg:hidden text-center mt-4 text-sm text-gray-500">
                ← Swipe to see more options →
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Ticket information coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Venue/Map Section */}
      {(event.venue || event.location) && (
        <section id="venue" className="py-12 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center" style={{ color: primaryColor }}>
              Venue
            </h2>

            <div className="bg-gray-50 p-4 sm:p-8 rounded-lg">
              {event.venue && (
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">{event.venue}</h3>
              )}
              
              <div className="space-y-2 text-sm sm:text-base text-gray-700">
                {event.addressLine1 && <p>{event.addressLine1}</p>}
                {event.city && (
                  <p>
                    {event.city}{event.state && `, ${event.state}`} {event.zipCode}
                  </p>
                )}
                {event.country && <p>{event.country}</p>}
              </div>

              {event.latitude && event.longitude && (
                <div className="mt-4 sm:mt-6">
                  <a
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm sm:text-base font-medium hover:underline"
                    style={{ color: primaryColor }}
                  >
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-2">{event.title}</h3>
              {event.organization && (
                <p className="text-sm text-gray-400">by {event.organization.name}</p>
              )}
            </div>

            {/* Social Links */}
            {(event.website || event.linkedinUrl || event.twitterUrl || event.instagramUrl) && (
              <div className="flex space-x-4">
                {event.website && (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <GlobeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {event.linkedinUrl && (
                  <a
                    href={event.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <LinkedinIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {event.twitterUrl && (
                  <a
                    href={event.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <TwitterIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {event.instagramUrl && (
                  <a
                    href={event.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <InstagramIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-400">
            <p>© {new Date().getFullYear()} {event.organization?.name || event.title}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
