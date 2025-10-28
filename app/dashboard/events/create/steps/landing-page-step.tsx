"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const landingPageSchema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  aboutSection: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
})

export function LandingPageStep({ data, onNext, onBack }: any) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(landingPageSchema),
    defaultValues: data || {
      primaryColor: '#000000',
      secondaryColor: '#ffffff'
    }
  })

  return (
    <form onSubmit={handleSubmit(onNext)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  {...register("primaryColor")}
                  className="w-20 h-10"
                />
                <Input
                  {...register("primaryColor")}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  {...register("secondaryColor")}
                  className="w-20 h-10"
                />
                <Input
                  {...register("secondaryColor")}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Social Media Links</h4>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input id="linkedinUrl" {...register("linkedinUrl")} placeholder="https://linkedin.com/company/..." />
              {errors.linkedinUrl && <p className="text-sm text-red-500">{errors.linkedinUrl.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter/X</Label>
              <Input id="twitterUrl" {...register("twitterUrl")} placeholder="https://twitter.com/..." />
              {errors.twitterUrl && <p className="text-sm text-red-500">{errors.twitterUrl.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input id="instagramUrl" {...register("instagramUrl")} placeholder="https://instagram.com/..." />
              {errors.instagramUrl && <p className="text-sm text-red-500">{errors.instagramUrl.message as string}</p>}
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Next: Review</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}


