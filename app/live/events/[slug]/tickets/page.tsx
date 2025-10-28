"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ChevronRight, MinusIcon, PlusIcon, CheckCircleIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"
import { BuyerFormWrapper } from "./components/buyer-form-wrapper"

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

interface TicketSelection {
  [ticketTypeId: string]: number
}

export default function TicketsPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({})
  const [promoCode, setPromoCode] = useState("")

  const primaryColor = event?.primaryColor || "#D4A574"
  const secondaryColor = event?.secondaryColor || "#ffffff"
  const currency = event?.currency || "USD"

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { slug } = await params
        const response = await fetch(`/api/events/public/${slug}`)
        if (!response.ok) {
          toast.error('Event not found')
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

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setSelectedTickets(prev => {
      const current = prev[ticketId] || 0
      const ticket = event?.ticketTypes.find(tt => tt.id === ticketId)
      if (!ticket) return prev

      const available = ticket.quantity - ticket.sold
      const newQuantity = Math.max(0, Math.min(current + change, available))
      
      if (newQuantity === 0) {
        const updated = { ...prev }
        delete updated[ticketId]
        return updated
      }
      
      return { ...prev, [ticketId]: newQuantity }
    })
  }

  const calculateOrderTotal = () => {
    if (!event) return { subtotal: 0, tax: 0, total: 0, totalTickets: 0 }

    let subtotal = 0
    let totalTickets = 0

    Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
      const ticket = event.ticketTypes.find(tt => tt.id === ticketId)
      if (ticket && quantity > 0) {
        subtotal += Number(ticket.price) * quantity
        totalTickets += quantity
      }
    })

    const tax = event.taxRate ? subtotal * (event.taxRate / 100) : 0
    const total = subtotal + tax

    return { subtotal, tax, total, totalTickets }
  }

  const getTicketDetails = () => {
    return event?.ticketTypes.map(ticket => ({
      ...ticket,
      quantity: selectedTickets[ticket.id] || 0
    })).filter(t => t.quantity > 0) || []
  }

  const isStep1Valid = () => {
    return Object.values(selectedTickets).some(qty => qty > 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading tickets...</div>
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

  const orderDetails = calculateOrderTotal()
  const selectedTicketDetails = getTicketDetails()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <header className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6" style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
        color: secondaryColor
      }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base opacity-90">
                <span>📅 {format(new Date(event.eventDate), "MMMM dd, yyyy")}</span>
                {event.location && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>📍 {event.location}</span>
                  </>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="self-end sm:self-auto"
              style={{ color: secondaryColor, borderColor: secondaryColor }}
              onClick={() => {
                params.then(({ slug }) => router.push(`/live/events/${slug}`))
              }}
            >
              ✕
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center py-3 sm:py-4 overflow-x-auto">
            {/* Step 1 */}
            <div className="flex items-center whitespace-nowrap">
              <div className={cn(
                "flex items-center gap-2 text-sm sm:text-base",
                currentStep >= 1 ? "text-black font-medium" : "text-gray-400"
              )}>
                {currentStep > 1 ? (
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: primaryColor }} />
                ) : (
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 flex items-center justify-center text-xs" style={{
                    borderColor: currentStep >= 1 ? primaryColor : 'currentColor',
                    color: currentStep >= 1 ? primaryColor : 'currentColor'
                  }}>
                    1
                  </div>
                )}
                <span className="hidden sm:inline">Select tickets</span>
                <span className="sm:hidden">Tickets</span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 mx-2 sm:mx-3 text-gray-400 shrink-0" />

            {/* Step 2 */}
            <div className="flex items-center whitespace-nowrap">
              <div className={cn(
                "flex items-center gap-2 text-sm sm:text-base",
                currentStep >= 2 ? "text-black font-medium" : "text-gray-400"
              )}>
                {currentStep > 2 ? (
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: primaryColor }} />
                ) : (
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 flex items-center justify-center text-xs" style={{
                    borderColor: currentStep >= 2 ? primaryColor : 'currentColor',
                    color: currentStep >= 2 ? primaryColor : 'currentColor'
                  }}>
                    2
                  </div>
                )}
                <span className="hidden sm:inline">Share details</span>
                <span className="sm:hidden">Details</span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 mx-2 sm:mx-3 text-gray-400 shrink-0" />

            {/* Step 3 */}
            <div className="flex items-center whitespace-nowrap">
              <div className={cn(
                "flex items-center gap-2 text-sm sm:text-base",
                currentStep >= 3 ? "text-black font-medium" : "text-gray-400"
              )}>
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 flex items-center justify-center text-xs" style={{
                  borderColor: currentStep >= 3 ? primaryColor : 'currentColor',
                  color: currentStep >= 3 ? primaryColor : 'currentColor'
                }}>
                  3
                </div>
                <span className="hidden sm:inline">Request Placed</span>
                <span className="sm:hidden">Placed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Tickets */}
      {currentStep === 1 && (
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 pb-32 md:pb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose your tickets</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {event.ticketTypes.filter(tt => tt.isActive).map((ticket) => {
              const available = ticket.quantity - ticket.sold
              const isSoldOut = available <= 0
              const quantity = selectedTickets[ticket.id] || 0

              return (
                <Card key={ticket.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold truncate">{ticket.name}</h3>
                          {ticket.requiresApproval && (
                            <Badge className="bg-yellow-500 text-black hover:bg-yellow-600 shrink-0">
                              Approval required
                            </Badge>
                          )}
                          {isSoldOut && (
                            <Badge variant="destructive" className="shrink-0">Sold Out</Badge>
                          )}
                        </div>
                        {ticket.description && (
                          <p className="text-sm sm:text-base text-muted-foreground mb-2 line-clamp-2">
                            {ticket.description}
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right sm:ml-4 shrink-0">
                        <p className="text-2xl sm:text-3xl font-bold" style={{ color: primaryColor }}>
                          {currency} {Number(ticket.price).toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {available} / {ticket.quantity} available
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {!isSoldOut && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm font-medium">Quantity</span>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 sm:h-10 sm:w-10"
                            onClick={() => updateTicketQuantity(ticket.id, -1)}
                            disabled={quantity <= 0}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <span className="text-lg sm:text-xl font-semibold w-10 sm:w-12 text-center">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 sm:h-10 sm:w-10"
                            onClick={() => updateTicketQuantity(ticket.id, 1)}
                            disabled={quantity >= available}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {ticket.customNotes && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-3 italic">
                        {ticket.customNotes}
                      </p>
                    )}
                    
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      Sales end on {format(new Date(event.eventDate), "MMMM dd, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {event.ticketTypes.filter(tt => tt.isActive).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tickets available at this time</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Share Details */}
      {currentStep === 2 && (
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Share your details</h2>
          <BuyerFormWrapper 
            eventId={event.id}
            selectedTickets={selectedTickets}
            orderDetails={orderDetails}
            currency={currency}
            onBack={() => setCurrentStep(1)}
            onSuccess={() => setCurrentStep(3)}
            primaryColor={primaryColor}
          />
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && (
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center space-y-6">
            <CheckCircleIcon className="mx-auto h-16 w-16 sm:h-24 sm:w-24" style={{ color: primaryColor }} />
            <h2 className="text-2xl sm:text-3xl font-bold">Request Placed!</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Your ticket request has been submitted successfully.
            </p>
            <div className="bg-white rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                {selectedTicketDetails.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between text-sm">
                    <span>{ticket.name} × {ticket.quantity}</span>
                    <span>{currency} {(Number(ticket.price) * ticket.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t font-bold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span style={{ color: primaryColor }}>{currency} {orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full sm:w-auto"
              style={{ backgroundColor: primaryColor, color: secondaryColor }}
              onClick={() => {
                params.then(({ slug }) => router.push(`/live/events/${slug}`))
              }}
            >
              Back to Event
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar - Only on Step 1 */}
      {currentStep === 1 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  {orderDetails.totalTickets} ticket{orderDetails.totalTickets !== 1 ? 's' : ''}
                </p>
                <p className="text-lg sm:text-xl font-bold truncate" style={{ color: primaryColor }}>
                  {currency} {orderDetails.total.toFixed(2)}
                </p>
              </div>
              <Button
                size="lg"
                className="shrink-0"
                style={{ 
                  backgroundColor: isStep1Valid() ? primaryColor : `${primaryColor}80`,
                  color: secondaryColor 
                }}
                onClick={() => {
                  if (isStep1Valid()) {
                    setCurrentStep(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  } else {
                    toast.error('Please select at least one ticket')
                  }
                }}
                disabled={!isStep1Valid()}
              >
                CONTINUE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
