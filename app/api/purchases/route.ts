import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { appClient } from '@/lib/auth0'
import { sendSimpleEmail } from '@/lib/email-apps-script'
import { z } from 'zod'
import { format } from 'date-fns'

const createPurchaseSchema = z.object({
  eventId: z.string(),
  ticketTypeId: z.string(),
  quantity: z.number().int().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  designation: z.string().optional(),
  billingName: z.string().min(1),
  billingAddressLine1: z.string().min(1),
  billingAddressLine2: z.string().optional(),
  billingCity: z.string().min(1),
  billingState: z.string().optional(),
  billingCountry: z.string().min(1),
  billingZipCode: z.string().min(1),
  subtotal: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { auth0OrgId: session.user.org_id }
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Fetch purchases for all events in this organization
    const purchases = await prisma.purchase.findMany({
      where: {
        event: {
          organizationId: organization.id
        }
      },
      include: {
        customer: true,
        event: true,
        ticketType: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPurchaseSchema.parse(body)

    // Get or create customer by email
    let customer = await prisma.customer.findUnique({
      where: { email: validatedData.email }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: validatedData.email,
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          phone: validatedData.phone
        }
      })
    }

    // Get ticket type to check availability
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: validatedData.ticketTypeId }
    })

    if (!ticketType) {
      return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 })
    }

    if (validatedData.quantity > (ticketType.quantity - ticketType.sold)) {
      return NextResponse.json({ error: 'Insufficient tickets available' }, { status: 400 })
    }

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        customerId: customer.id,
        eventId: validatedData.eventId,
        ticketTypeId: validatedData.ticketTypeId,
        quantity: validatedData.quantity,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        designation: validatedData.designation,
        billingName: validatedData.billingName,
        billingAddressLine1: validatedData.billingAddressLine1,
        billingAddressLine2: validatedData.billingAddressLine2,
        billingCity: validatedData.billingCity,
        billingState: validatedData.billingState,
        billingCountry: validatedData.billingCountry,
        billingZipCode: validatedData.billingZipCode,
        subtotal: validatedData.subtotal,
        taxAmount: validatedData.taxAmount,
        totalAmount: validatedData.totalAmount,
        status: 'PENDING'
      }
    })

    // Get event and organization details for email
    const event = await prisma.event.findUnique({
      where: { id: purchase.eventId },
      include: { organization: true }
    })

    const ticketTypeDetails = await prisma.ticketType.findUnique({
      where: { id: purchase.ticketTypeId }
    })

    // Send HTML email to the buyer immediately
    try {
      const { generatePurchaseConfirmationEmail } = await import('@/lib/email-templates')
      
      const htmlContent = generatePurchaseConfirmationEmail({
        customerName: `${purchase.firstName} ${purchase.lastName}`,
        eventTitle: event?.title || 'Event',
        eventDate: event?.eventDate ? format(new Date(event.eventDate), "MMMM d, yyyy 'at' h:mm a") : 'TBD',
        ticketTypeName: ticketTypeDetails?.name || 'Ticket',
        quantity: purchase.quantity,
        totalAmount: purchase.totalAmount.toString(),
        purchaseId: purchase.id,
        organizationName: event?.organization.name || 'Event Team',
        customerEmail: purchase.email,
        eventLocation: (event?.location || event?.venue) || undefined
      })

      await sendSimpleEmail({
        to: purchase.email,
        subject: `Ticket Request Received: ${event?.title || 'Event'}`,
        body: htmlContent,
        isHtml: true
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the purchase creation if email fails
    }

    // Send notification email to marcom@radcommgroup.com
    try {
      await sendSimpleEmail({
        to: 'marcom@radcommgroup.com',
        subject: `New Ticket Purchase Request: ${event?.title || 'Event'}`,
        body: `A new ticket purchase request requires your approval.

EVENT DETAILS:
- Event: ${event?.title || 'Event'}
- Organization: ${event?.organization.name || 'N/A'}

BUYER INFORMATION:
- Name: ${purchase.firstName} ${purchase.lastName}
- Email: ${purchase.email}
- Phone: ${purchase.phone || 'N/A'}
- Company: ${purchase.company || 'N/A'}
- Designation: ${purchase.designation || 'N/A'}

PURCHASE DETAILS:
- Ticket Type: ${ticketTypeDetails?.name || 'Ticket'}
- Quantity: ${purchase.quantity}
- Subtotal: $${purchase.subtotal}
- Tax: $${purchase.taxAmount}
- Total Amount: $${purchase.totalAmount}

BILLING ADDRESS:
${purchase.billingAddressLine1}
${purchase.billingAddressLine2 ? purchase.billingAddressLine2 + '\n' : ''}${purchase.billingCity}, ${purchase.billingState || ''} ${purchase.billingZipCode}
${purchase.billingCountry}

PURCHASE ID: ${purchase.id}
STATUS: PENDING

Please review and approve or reject this request in the dashboard.

Thank you.`
      })
    } catch (emailError) {
      console.error('Error sending approval notification email:', emailError)
      // Don't fail the purchase creation if email fails
    }

    return NextResponse.json({
      id: purchase.id,
      status: purchase.status,
      totalAmount: purchase.totalAmount
    })
  } catch (error) {
    console.error('Error creating purchase:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.format() }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
