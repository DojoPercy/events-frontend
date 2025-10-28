import { NextRequest, NextResponse } from 'next/server'
import { appClient } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { createEventSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization from Auth0 org_id
    const organization = await prisma.organization.findUnique({
      where: { auth0OrgId: session.user.org_id },
      include: {
        events: {
          include: {
            ticketTypes: true,
            purchases: true,
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    return NextResponse.json(organization.events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/events - Starting request processing')
    
    const session = await appClient.getSession()
    console.log('Session:', session?.user?.org_id ? 'Found' : 'Not found')
    
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const { ticketTypes, ...eventData } = body
    console.log('Event data:', eventData)
    console.log('Ticket types:', ticketTypes)
    
    const validatedData = createEventSchema.parse(eventData)
    console.log('Validated data:', validatedData)

    // Get or create organization
    let organization = await prisma.organization.findUnique({
      where: { auth0OrgId: session.user.org_id }
    })

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          auth0OrgId: session.user.org_id,
          name: session.user.org_name || 'Unknown Organization'
        }
      })
    }

    // Create event with slug (avoid passing ticketTypes inadvertently)
    const slug = validatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description ?? null,
        location: validatedData.location ?? null,
        imageUrl: validatedData.imageUrl ?? null,
        isPublished: validatedData.isPublished ?? false,
        slug,
        eventDate: new Date(validatedData.eventDate),
        organizationId: organization.id,
      }
    })

    // Create ticket types if provided
    if (ticketTypes && ticketTypes.length > 0) {
      await prisma.ticketType.createMany({
        data: ticketTypes.map((tt: any) => ({
          eventId: event.id,
          name: tt.name,
          description: tt.description || '',
          price: tt.price,
          quantity: tt.quantity,
          sold: 0
        }))
      })
    }

    // Return event with ticket types
    const eventWithTickets = await prisma.event.findUnique({
      where: { id: event.id },
      include: { ticketTypes: true }
    })

    return NextResponse.json(eventWithTickets)
  } catch (error) {
    console.error('Error creating event:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

