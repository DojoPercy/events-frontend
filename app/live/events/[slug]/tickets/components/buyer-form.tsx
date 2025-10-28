"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface BuyerFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  designation?: string
  billingName: string
  billingAddressLine1: string
  billingAddressLine2?: string
  billingCity: string
  billingState?: string
  billingCountry: string
  billingZipCode: string
}

interface BuyerFormProps {
  onSubmit: (data: BuyerFormData) => void
  onBack: () => void
  primaryColor: string
}

export function BuyerForm({ onSubmit, onBack, primaryColor }: BuyerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BuyerFormData>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Buyer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" {...register("firstName", { required: "Required" })} />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" {...register("lastName", { required: "Required" })} />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" {...register("email", { required: "Required", pattern: /^\S+@\S+$/i })} />
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
          <Input id="billingName" {...register("billingName", { required: "Required" })} />
          {errors.billingName && <p className="text-sm text-red-500 mt-1">{errors.billingName.message}</p>}
        </div>

        <div>
          <Label htmlFor="billingAddressLine1">Address Line 1 *</Label>
          <Input id="billingAddressLine1" {...register("billingAddressLine1", { required: "Required" })} />
          {errors.billingAddressLine1 && <p className="text-sm text-red-500 mt-1">{errors.billingAddressLine1.message}</p>}
        </div>

        <div>
          <Label htmlFor="billingAddressLine2">Address Line 2</Label>
          <Input id="billingAddressLine2" {...register("billingAddressLine2")} />
        </div>

        <div>
          <Label htmlFor="billingCity">City *</Label>
          <Input id="billingCity" {...register("billingCity", { required: "Required" })} />
          {errors.billingCity && <p className="text-sm text-red-500 mt-1">{errors.billingCity.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billingState">State/Province</Label>
            <Input id="billingState" {...register("billingState")} />
          </div>
          <div>
            <Label htmlFor="billingZipCode">Zip Code *</Label>
            <Input id="billingZipCode" {...register("billingZipCode", { required: "Required" })} />
            {errors.billingZipCode && <p className="text-sm text-red-500 mt-1">{errors.billingZipCode.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="billingCountry">Country *</Label>
          <Input id="billingCountry" {...register("billingCountry", { required: "Required" })} />
          {errors.billingCountry && <p className="text-sm text-red-500 mt-1">{errors.billingCountry.message}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          style={{ backgroundColor: primaryColor }}
        >
          Submit Request
        </Button>
      </div>
    </form>
  )
}

