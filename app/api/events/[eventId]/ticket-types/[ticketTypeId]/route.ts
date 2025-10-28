import { NextRequest, NextResponse } from 'next/server'
import { appClient } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { updateTicketTypeSchema } from '@/lib/validation'

export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string; ticketTypeId: string } }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateTicketTypeSchema.parse(body)

    // Check if ticket type belongs to user's organization
    const ticketType = await prisma.ticketType.findFirst({
      where: {
        id: params.ticketTypeId,
        event: {
          organization: {
            auth0OrgId: session.user.org_id
          }
        }
      }
    })

    if (!ticketType) {
      return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 })
    }

    const updatedTicketType = await prisma.ticketType.update({
      where: { id: params.ticketTypeId },
      data: validatedData
    })

    return NextResponse.json(updatedTicketType)
  } catch (error) {
    console.error('Error updating ticket type:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string; ticketTypeId: string } }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if ticket type belongs to user's organization
    const ticketType = await prisma.ticketType.findFirst({
      where: {
        id: params.ticketTypeId,
        event: {
          organization: {
            auth0OrgId: session.user.org_id
          }
        }
      }
    })

    if (!ticketType) {
      return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 })
    }

    await prisma.ticketType.delete({
      where: { id: params.ticketTypeId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ticket type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

