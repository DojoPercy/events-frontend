"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { format } from "date-fns"

export function ReviewStep({ data, onBack, onPublish }: any) {
  const [isPublished, setIsPublished] = useState(false)

  const handlePublish = () => {
    onPublish({ ...data, isPublished, isDraft: false })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Event Information</h3>
            <dl className="space-y-1 text-sm">
              <div><dt className="font-medium inline">Title:</dt> <dd className="inline ml-2">{data.title}</dd></div>
              <div><dt className="font-medium inline">Date:</dt> <dd className="inline ml-2">{data.eventDate ? format(new Date(data.eventDate), 'PPP p') : 'Not set'}</dd></div>
              <div><dt className="font-medium inline">Location:</dt> <dd className="inline ml-2">{data.venue}, {data.city}</dd></div>
              <div><dt className="font-medium inline">Timezone:</dt> <dd className="inline ml-2">{data.timezone}</dd></div>
            </dl>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Ticketing</h3>
            <dl className="space-y-2 text-sm">
              <div><dt className="font-medium">Currency:</dt> <dd>{data.currency}</dd></div>
              {data.taxRate && <div><dt className="font-medium">Tax:</dt> <dd>{data.taxName} {data.taxRate}%</dd></div>}
              <div><dt className="font-medium">Ticket Types:</dt></div>
              {data.ticketTypes?.map((ticket: any, i: number) => (
                <dd key={i} className="ml-4">
                  • {ticket.name} - {data.currency} {ticket.price} ({ticket.quantity} available)
                  {ticket.requiresApproval && <span className="text-orange-600 ml-2">(Requires approval)</span>}
                </dd>
              ))}
            </dl>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="publish"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="publish">Publish event and make it visible to public</Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isPublished 
                ? 'Event will be immediately visible on the public events page' 
                : 'Event will be saved as draft and not visible to public'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Back
            </Button>
            <Button 
              onClick={handlePublish}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isPublished ? 'Publish Event' : 'Save as Draft'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


