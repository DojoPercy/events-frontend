"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, TrashIcon } from "lucide-react"

const ticketingSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  taxRate: z.number().min(0).max(100).optional(),
  taxName: z.string().optional(),
  taxInclusive: z.boolean().default(false),
  ticketTypes: z.array(z.object({
    name: z.string().min(1, 'Ticket name is required'),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    maxPerOrder: z.number().int().optional(),
    requiresApproval: z.boolean().default(false),
    customNotes: z.string().optional(),
  })).min(1, 'At least one ticket type is required'),
})

export function TicketingStep({ data, eventId, onNext, onBack }: any) {
  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(ticketingSchema),
    defaultValues: data || {
      currency: 'AED',
      taxInclusive: false,
      ticketTypes: [{ name: '', price: 0, quantity: 0, requiresApproval: false }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes"
  })

  const taxRate = watch('taxRate')
  const currency = watch('currency')

  const currencies = ['USD', 'AED', 'EUR', 'GBP', 'SGD']

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax & Currency Settings</CardTitle>
            <CardDescription>Configure billing and tax calculation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select onValueChange={(value) => setValue('currency', value)} defaultValue={watch('currency')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  {...register("taxRate", { valueAsNumber: true })}
                  placeholder="5.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxName">Tax Name</Label>
                <Input id="taxName" {...register("taxName")} placeholder="VAT" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="taxInclusive"
                checked={watch('taxInclusive')}
                onCheckedChange={(checked) => setValue('taxInclusive', checked)}
              />
              <Label htmlFor="taxInclusive">Tax inclusive pricing</Label>
              <p className="text-xs text-muted-foreground ml-2">
                (Display price includes tax)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Ticket Types</CardTitle>
                <CardDescription>Configure different ticket tiers and pricing</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', price: 0, quantity: 0, requiresApproval: false })}
              >
                <PlusIcon className="h-4 w-4 mr-2" /> Add Ticket Type
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Ticket Type {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ticket Name *</Label>
                      <Input
                        {...register(`ticketTypes.${index}.name`)}
                        placeholder="Platinum Table - 10 Seats"
                      />
                      {errors.ticketTypes?.[index]?.name && (
                        <p className="text-sm text-red-500">{errors.ticketTypes[index]?.name?.message as string}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Price ({currency}) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`ticketTypes.${index}.price`, { valueAsNumber: true })}
                        placeholder="23319.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`ticketTypes.${index}.description`)}
                      placeholder="Includes 10 seats, premium dining, awards ceremony..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Available Quantity *</Label>
                      <Input
                        type="number"
                        {...register(`ticketTypes.${index}.quantity`, { valueAsNumber: true })}
                        placeholder="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Per Order</Label>
                      <Input
                        type="number"
                        {...register(`ticketTypes.${index}.maxPerOrder`, { valueAsNumber: true })}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`requiresApproval-${index}`}
                      checked={watch(`ticketTypes.${index}.requiresApproval`)}
                      onCheckedChange={(checked) => setValue(`ticketTypes.${index}.requiresApproval`, checked)}
                    />
                    <Label htmlFor={`requiresApproval-${index}`}>Requires approval before confirmation</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Notes (shown to buyers)</Label>
                    <Textarea
                      {...register(`ticketTypes.${index}.customNotes`)}
                      placeholder="Ticket includes access to cocktail reception, awards ceremony, and networking session."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      These notes will be displayed on the ticket selection page
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>Back</Button>
          <Button type="submit">Next: Landing Page</Button>
        </div>
      </div>
    </form>
  )
}


