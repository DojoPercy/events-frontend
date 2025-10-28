"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"

const eventInfoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  eventDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
})

export function EventInfoStep({ data, onNext, isFirstStep }: any) {
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: zodResolver(eventInfoSchema),
    defaultValues: data || {},
    mode: 'onChange'
  })

  const logoUrl = watch('logoUrl')
  const coverImageUrl = watch('coverImageUrl')
  const title = watch('title')
  const eventDate = watch('eventDate')

  const isFormValid = title && eventDate

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Event Information</CardTitle>
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
            {errors.title && <p className="text-xs sm:text-sm text-red-500">{errors.title.message as string}</p>}
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
              {errors.eventDate && <p className="text-xs sm:text-sm text-red-500">{errors.eventDate.message as string}</p>}
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

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Event Logo</Label>
            <ImageUpload
              value={logoUrl || ''}
              onChange={(url) => setValue('logoUrl', url)}
              label="Event Logo"
              description="Logo for navigation and hero section (recommended: 400x400px, PNG with transparent background)"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Cover Image</Label>
            <ImageUpload
              value={coverImageUrl || ''}
              onChange={(url) => setValue('coverImageUrl', url)}
              label="Cover Image"
              description="Hero banner (recommended: 1920x600px)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm sm:text-base">Event Website (optional)</Label>
            <Input 
              id="website" 
              {...register("website")} 
              placeholder="https://example.com"
              className="text-sm sm:text-base"
            />
            {errors.website && <p className="text-xs sm:text-sm text-red-500">{errors.website.message as string}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit"
              disabled={!isFormValid}
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              Next: Location & Timezone
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}


