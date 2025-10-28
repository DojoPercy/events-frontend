import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch only published events (public access)
    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        isDraft: false,
      },
      include: {
        ticketTypes: {
          where: { isActive: true }
        },
      },
      orderBy: { eventDate: 'asc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching published events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

