"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPinIcon } from "lucide-react"
import { toast } from "sonner"

const locationSchema = z.object({
  venue: z.string().min(1, 'Venue name is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  placeId: z.string().optional(),
})

export function LocationStep({ data, onNext, onBack }: any) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: data || { timezone: 'UTC' }
  })

  const [autocomplete, setAutocomplete] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load Google Places API
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
      script.async = true
      script.onload = initAutocomplete
      document.head.appendChild(script)
    } else if ((window as any).google) {
      initAutocomplete()
    }
  }, [])

  const initAutocomplete = () => {
    if (!inputRef.current || !(window as any).google) return

    const autocompleteInstance = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
      fields: ['address_components', 'geometry', 'place_id', 'name']
    })

    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace()
      
      if (!place.geometry) {
        toast.error('No details available for this place')
        return
      }

      // Parse address components
      const addressComponents = place.address_components
      const getComponent = (type: string) => {
        const component = addressComponents?.find((c: any) => c.types.includes(type))
        return component?.long_name || ''
      }

      setValue('venue', place.name || '')
      setValue('addressLine1', `${getComponent('street_number')} ${getComponent('route')}`.trim())
      setValue('city', getComponent('locality') || getComponent('administrative_area_level_2'))
      setValue('state', getComponent('administrative_area_level_1'))
      setValue('country', getComponent('country'))
      setValue('zipCode', getComponent('postal_code'))
      setValue('latitude', place.geometry.location.lat())
      setValue('longitude', place.geometry.location.lng())
      setValue('placeId', place.place_id)

      toast.success('Location details filled automatically')
    })

    setAutocomplete(autocompleteInstance)
  }

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
    'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore',
    'Asia/Tokyo', 'Australia/Sydney'
  ]

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <Card>
        <CardHeader>
          <CardTitle>Location & Timezone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="venue-search">Search Venue *</Label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                id="venue-search"
                className="pl-10"
                placeholder="Search for venue (e.g., Palazzo Versace Dubai)"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Start typing to search for venues using Google Places
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue Name *</Label>
            <Input id="venue" {...register("venue")} placeholder="Palazzo Versace Dubai" />
            {errors.venue && <p className="text-sm text-red-500">{errors.venue.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1 *</Label>
            <Input id="addressLine1" {...register("addressLine1")} placeholder="Culture Village" />
            {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input id="addressLine2" {...register("addressLine2")} placeholder="Suite, Floor, etc." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} placeholder="Dubai" />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/Emirate</Label>
              <Input id="state" {...register("state")} placeholder="Dubai" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" {...register("country")} placeholder="United Arab Emirates" />
              {errors.country && <p className="text-sm text-red-500">{errors.country.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code</Label>
              <Input id="zipCode" {...register("zipCode")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone *</Label>
            <Select onValueChange={(value) => setValue('timezone', value)} defaultValue={watch('timezone')}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timezone && <p className="text-sm text-red-500">{errors.timezone.message as string}</p>}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Next: Ticketing</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}


