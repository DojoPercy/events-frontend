import { NextRequest, NextResponse } from 'next/server'
import { appClient } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { updateEventSchema } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organization: {
          auth0OrgId: session.user.org_id
        }
      },
      include: {
        ticketTypes: true,
        purchases: {
          include: {
            customer: true,
            ticketType: true,
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params
    const body = await request.json()
    const { ticketTypes, currentStep, ...eventData } = body

    // Check if event belongs to user's organization
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        organization: {
          auth0OrgId: session.user.org_id
        }
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Valid Event model fields only
    const validEventFields = [
      'title', 'description', 'slug', 'eventDate', 'endDate', 'timezone',
      'venue', 'addressLine1', 'addressLine2', 'city', 'state', 'country', 'zipCode',
      'latitude', 'longitude', 'placeId', 'imageUrl', 'coverImageUrl', 'logoUrl',
      'isPublished', 'isDraft', 'primaryColor', 'secondaryColor', 'heroTitle',
      'heroSubtitle', 'aboutSection', 'website', 'linkedinUrl', 'twitterUrl',
      'instagramUrl', 'currency', 'taxRate', 'taxName', 'taxInclusive'
    ]

    // Update event - only include valid fields
    const updateData: any = {}
    
    Object.keys(eventData).forEach(key => {
      if (validEventFields.includes(key) && eventData[key] !== undefined) {
        // Convert empty strings to null for optional fields
        if (eventData[key] === '') {
          updateData[key] = null
        } else {
          updateData[key] = eventData[key]
        }
      }
    })

    // Handle date fields
    if (updateData.eventDate) updateData.eventDate = new Date(updateData.eventDate)
    if (updateData.endDate) {
      // If endDate is an empty string, set to null instead
      if (updateData.endDate === '') {
        updateData.endDate = null
      } else {
        updateData.endDate = new Date(updateData.endDate)
      }
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: updateData
    })

    // Handle ticket types update if provided
    if (ticketTypes && ticketTypes.length > 0) {
      await prisma.ticketType.deleteMany({
        where: { eventId }
      })

      await prisma.ticketType.createMany({
        data: ticketTypes.map((tt: any) => ({
          eventId,
          name: tt.name,
          description: tt.description || '',
          price: tt.price,
          quantity: tt.quantity,
          sold: 0,
          requiresApproval: tt.requiresApproval || false,
          customNotes: tt.customNotes || '',
          maxPerOrder: tt.maxPerOrder || null
        }))
      })
    }

    // Return event with ticket types
    const eventWithTickets = await prisma.event.findUnique({
      where: { id: eventId },
      include: { ticketTypes: true }
    })

    return NextResponse.json(eventWithTickets)
  } catch (error) {
    console.error('Error updating event:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params

    // Check if event belongs to user's organization
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        organization: {
          auth0OrgId: session.user.org_id
        }
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    await prisma.event.delete({
      where: { id: eventId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
