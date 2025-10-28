"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EventInfoStep } from "./steps/event-info-step"
import { TicketingStep } from "./steps/ticketing-step"
import { LandingPageStep } from "./steps/landing-page-step"
import { LocationStep } from "./steps/location-step"
import { ReviewStep } from "./steps/review-step"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const STEPS = [
  { id: 1, name: "Event Info", component: EventInfoStep },
  { id: 2, name: "Location & Timezone", component: LocationStep },
  { id: 3, name: "Ticketing", component: TicketingStep },
  { id: 4, name: "Landing Page", component: LandingPageStep },
  { id: 5, name: "Review & Publish", component: ReviewStep }
]

export default function CreateEventWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [eventId, setEventId] = useState<string | null>(searchParams.get('id'))
  const [eventData, setEventData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)

  // Load existing event if resuming
  useEffect(() => {
    if (eventId) {
      loadEvent(eventId)
    }
  }, [eventId])

  const loadEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}-single`)
      if (response.ok) {
        const event = await response.json()
        setEventData(event)
        // Determine which step to show based on completeness
        if (!event.venue) setCurrentStep(2)
        else if (!event.ticketTypes?.length) setCurrentStep(3)
        else if (!event.heroTitle) setCurrentStep(4)
        else setCurrentStep(5)
      }
    } catch (error) {
      console.error('Failed to load event:', error)
    }
  }

  // Auto-save function
  const saveProgress = async (data: any, isComplete: boolean = false) => {
    setIsSaving(true)
    try {
      const url = eventId 
        ? `/api/events/${eventId}` 
        : `/api/events/draft`
      
      const response = await fetch(url, {
        method: eventId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          isDraft: !isComplete,
          currentStep
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      const event = await response.json()
      
      if (!eventId) {
        setEventId(event.id)
        // Update URL with eventId for bookmarking
        window.history.replaceState(null, '', `/dashboard/events/create?id=${event.id}`)
      }

      setEventData(prev => ({ ...prev, ...data }))
      return event
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save progress')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleStepComplete = async (data: any) => {
    await saveProgress(data)
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePublish = async (data: any) => {
    await saveProgress(data, true)
    toast.success('Event published successfully!')
    router.push('/dashboard/events')
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component
  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Create New Event
            </h1>
            <p className="text-muted-foreground mt-1">Complete all steps to publish your event</p>
          </div>
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Saving...</span>
            </div>
          )}
        </div>
        
        <Progress value={progress} className="h-3 mb-8" />
        
        <div className="flex items-center justify-between px-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  currentStep >= step.id
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                    : currentStep === step.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/30 bg-card text-muted-foreground"
                )}>
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <span className={cn(
                  "mt-2 text-xs font-medium max-w-[100px] text-center",
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.name}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="h-1 w-16 mx-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: currentStep > step.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <CurrentStepComponent
        data={eventData}
        eventId={eventId}
        onNext={handleStepComplete}
        onBack={handleBack}
        onPublish={handlePublish}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === STEPS.length}
      />
    </div>
  )
}


