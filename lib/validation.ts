import { z } from 'zod'

// Ticket type validation schemas
export const createTicketTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  isActive: z.boolean().optional().default(true),
  requiresApproval: z.boolean().optional().default(false),
  customNotes: z.string().optional(),
})

export const updateTicketTypeSchema = createTicketTypeSchema.partial()

// Event validation schemas
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  location: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
  ticketTypes: z.array(createTicketTypeSchema).optional(),
})

export const updateEventSchema = createEventSchema.partial()

// Purchase validation schemas
export const createPurchaseSchema = z.object({
  customerName: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().optional(),
  ticketTypeId: z.string().min(1, 'Ticket type is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

export const updatePurchaseStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().optional(),
})

// Customer validation schemas
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type CreateTicketTypeInput = z.infer<typeof createTicketTypeSchema>
export type UpdateTicketTypeInput = z.infer<typeof updateTicketTypeSchema>
export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>
export type UpdatePurchaseStatusInput = z.infer<typeof updatePurchaseStatusSchema>
export type CustomerInput = z.infer<typeof customerSchema>
