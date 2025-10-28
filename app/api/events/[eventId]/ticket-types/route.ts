import { NextRequest, NextResponse } from 'next/server'
import { appClient } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { createTicketTypeSchema, updateTicketTypeSchema } from '@/lib/validation'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTicketTypeSchema.parse(body)

    const { eventId } = await params

    // Check if event belongs to user's organization
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organization: {
          auth0OrgId: session.user.org_id
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const ticketType = await prisma.ticketType.create({
      data: {
        ...validatedData,
        eventId: eventId,
      }
    })

    return NextResponse.json(ticketType)
  } catch (error) {
    console.error('Error creating ticket type:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

