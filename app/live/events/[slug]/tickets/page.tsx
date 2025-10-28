"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, MapPinIcon, ChevronRightIcon, MinusIcon, PlusIcon, CheckCircleIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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

interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function TicketsPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({})
  const [promoCode, setPromoCode] = useState("")
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const primaryColor = event?.primaryColor || "#D4A574"
  const secondaryColor = event?.secondaryColor || "#ffffff"

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

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setSelectedTickets(prev => {
      const current = prev[ticketId] || 0
      const available = event?.ticketTypes.find(tt => tt.id === ticketId)
      const newQuantity = Math.max(0, Math.min(current + change, available ? available.quantity - available.sold : 0))
      
      if (newQuantity === 0) {
        const updated = { ...prev }
        delete updated[ticketId]
        return updated
      }
      
      return { ...prev, [ticketId]: newQuantity }
    })
  }

  const calculateOrderTotal = () => {
    if (!event) return { subtotal: 0, tax: 0, total: 0 }

    let subtotal = 0
    Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
      const ticket = event.ticketTypes.find(tt => tt.id === ticketId)
      if (ticket && quantity > 0) {
        subtotal += Number(ticket.price) * quantity
      }
    })

    const tax = event.taxRate ? subtotal * (event.taxRate / 100) : 0
    const total = subtotal + tax

    return { subtotal, tax, total }
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

  const orderDetails = calculateOrderTotal()
  const selectedTicketDetails = getTicketDetails()

  return (
    <div className="min-h-screen" style={{
      '--primary-color': primaryColor,
      '--secondary-color': secondaryColor,
    } as React.CSSProperties}>
      {/* Header Bar */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: primaryColor, color: 'white' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <div className="text-sm opacity-90">
                {format(new Date(event.eventDate), "MMM d, yyyy")} • {event.venue || event.location}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={() => {
                params.then(({ slug }) => router.push(`/live/events/${slug}`))
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-4 py-4">
            <div className={`flex items-center ${step >= 1 ? 'text-black font-semibold' : 'text-gray-400'}`}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current mr-2">
                {step > 1 ? '✓' : '1'}
              </span>
              Select tickets
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center ${step >= 2 ? 'text-black font-semibold' : 'text-gray-400'}`}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current mr-2">
                {step > 2 ? '✓' : '2'}
              </span>
              Share details
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center ${step >= 3 ? 'text-black font-semibold' : 'text-gray-400'}`}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current mr-2">
                {step > 3 ? '✓' : '3'}
              </span>
              Request Placed
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Tickets */}
      {step === 1 && (
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Ticket Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose your tickets</h2>
              <div className="space-y-6">
                {event.ticketTypes.filter(tt => tt.isActive).map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{ticket.name}</h3>
                          {ticket.requiresApproval && (
                            <Badge className="bg-yellow-400 text-black">Approval required</Badge>
                          )}
                        </div>
                        {ticket.description && (
                          <p className="text-gray-600 mb-2">{ticket.description}</p>
                        )}
                        {ticket.customNotes && (
                          <p className="text-sm text-gray-500 mb-2">{ticket.customNotes}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Sales end on {format(new Date(event.eventDate), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-3xl font-bold">
                          {event.currency} {Number(ticket.price).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {ticket.quantity - ticket.sold} available
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4 pt-4 border-t">
                      <span className="text-sm font-medium">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTicketQuantity(ticket.id, -1)}
                          disabled={(selectedTickets[ticket.id] || 0) <= 0}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {selectedTickets[ticket.id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTicketQuantity(ticket.id, 1)}
                          disabled={(selectedTickets[ticket.id] || 0) >= (ticket.quantity - ticket.sold)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Promo Code */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Promotional code</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      className="px-6"
                      onClick={() => toast.info('Promo code functionality coming soon')}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h3 className="font-semibold mb-4">Your order</h3>
                  {selectedTicketDetails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="text-6xl mb-4">🎫</div>
                      <p className="text-gray-500">Please choose a ticket class to continue</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTicketDetails.map((ticket) => (
                        <div key={ticket.id} className="flex justify-between items-start border-b pb-3">
                          <div>
                            <div className="font-medium">{ticket.name}</div>
                            <div className="text-sm text-gray-500">Qty: {ticket.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{event.currency} {(Number(ticket.price) * ticket.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-3 space-y-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>{event.currency} {orderDetails.subtotal.toFixed(2)}</span>
                        </div>
                        {event.taxRate && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{event.taxName || 'Tax'} ({event.taxRate}%)</span>
                            <span>{event.currency} {orderDetails.tax.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span style={{ color: primaryColor }}>
                            {event.currency} {orderDetails.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => {
                    if (isStep1Valid()) {
                      setStep(2)
                    } else {
                      toast.error('Please select at least one ticket')
                    }
                  }}
                  disabled={!isStep1Valid()}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Share Details */}
      {step === 2 && (
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Share your details</h2>
              <BuyerFormWrapper 
                eventId={event.id}
                selectedTickets={selectedTickets}
                orderDetails={orderDetails}
                currency={event.currency}
                onBack={() => setStep(1)}
                onSuccess={() => setStep(3)}
                primaryColor={primaryColor}
              />
            </div>

            {/* Order Summary (Sticky) */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                {selectedTicketDetails.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between">
                    <span>{ticket.name} × {ticket.quantity}</span>
                    <span className="font-semibold">{event.currency} {(Number(ticket.price) * ticket.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t font-bold text-lg">
                  Total: <span style={{ color: primaryColor }}>{event.currency} {orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="container mx-auto px-6 py-8 max-w-2xl">
          <div className="text-center space-y-6">
            <CheckCircleIcon className="mx-auto h-24 w-24" style={{ color: primaryColor }} />
            <h2 className="text-3xl font-bold">Request Placed</h2>
            <p className="text-lg text-gray-600">
              Your ticket request has been submitted for approval.
            </p>
            <Button
              size="lg"
              style={{ backgroundColor: primaryColor }}
              onClick={() => {
                params.then(({ slug }) => router.push(`/live/events/${slug}`))
              }}
            >
              Back to Event
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

