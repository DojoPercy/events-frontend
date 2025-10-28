"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"

const buyerFormSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  designation: z.string().optional(),
  billingName: z.string().min(1, "Required"),
  billingAddressLine1: z.string().min(1, "Required"),
  billingAddressLine2: z.string().optional(),
  billingCity: z.string().min(1, "Required"),
  billingState: z.string().optional(),
  billingCountry: z.string().min(1, "Required"),
  billingZipCode: z.string().min(1, "Required"),
})

type BuyerFormData = z.infer<typeof buyerFormSchema>

interface BuyerFormWrapperProps {
  eventId: string
  selectedTickets: Record<string, number>
  orderDetails: { subtotal: number; tax: number; total: number }
  currency: string
  onBack: () => void
  onSuccess: () => void
  primaryColor: string
}

export function BuyerFormWrapper({
  eventId,
  selectedTickets,
  orderDetails,
  currency,
  onBack,
  onSuccess,
  primaryColor
}: BuyerFormWrapperProps) {
  const [submitting, setSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerFormSchema)
  })

  const onSubmit = async (data: BuyerFormData) => {
    setSubmitting(true)
    try {
      // Submit purchase for each selected ticket type
      const purchasePromises = Object.entries(selectedTickets).map(([ticketTypeId, quantity]) => {
        if (quantity > 0) {
          return fetch('/api/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventId,
              ticketTypeId,
              quantity,
              ...data,
              subtotal: orderDetails.subtotal,
              taxAmount: orderDetails.tax,
              totalAmount: orderDetails.total,
            })
          })
        }
      })

      await Promise.all(purchasePromises)
      
      toast.success('Ticket request submitted! You will receive an email confirmation once approved.')
      onSuccess()
    } catch (error) {
      console.error('Error submitting purchase:', error)
      toast.error('Failed to submit purchase request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Buyer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register("company")} />
          </div>
          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input id="designation" {...register("designation")} />
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Information</h3>
        
        <div>
          <Label htmlFor="billingName">Billing Name *</Label>
          <Input id="billingName" {...register("billingName")} />
          {errors.billingName && <p className="text-sm text-red-500 mt-1">{errors.billingName.message}</p>}
        </div>

        <div>
          <Label htmlFor="billingAddressLine1">Address Line 1 *</Label>
          <Input id="billingAddressLine1" {...register("billingAddressLine1")} />
          {errors.billingAddressLine1 && <p className="text-sm text-red-500 mt-1">{errors.billingAddressLine1.message}</p>}
        </div>

        <div>
          <Label htmlFor="billingAddressLine2">Address Line 2</Label>
          <Input id="billingAddressLine2" {...register("billingAddressLine2")} />
        </div>

        <div>
          <Label htmlFor="billingCity">City *</Label>
          <Input id="billingCity" {...register("billingCity")} />
          {errors.billingCity && <p className="text-sm text-red-500 mt-1">{errors.billingCity.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billingState">State/Province</Label>
            <Input id="billingState" {...register("billingState")} />
          </div>
          <div>
            <Label htmlFor="billingZipCode">Zip Code *</Label>
            <Input id="billingZipCode" {...register("billingZipCode")} />
            {errors.billingZipCode && <p className="text-sm text-red-500 mt-1">{errors.billingZipCode.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="billingCountry">Country *</Label>
          <Input id="billingCountry" {...register("billingCountry")} />
          {errors.billingCountry && <p className="text-sm text-red-500 mt-1">{errors.billingCountry.message}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={submitting}>
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={submitting}
          style={{ backgroundColor: primaryColor }}
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  )
}

