import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('[PUBLISHED EVENTS API] Fetching published events')
    
    // Fetch published events OR non-draft events (public access)
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { isPublished: true },
          { isDraft: false }
        ]
      },
      include: {
        ticketTypes: {
          where: { isActive: true }
        },
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: { eventDate: 'asc' }
    })

    console.log(`[PUBLISHED EVENTS API] Found ${events.length} events`)
    return NextResponse.json(events)
  } catch (error) {
    console.error('[PUBLISHED EVENTS API] Error fetching published events:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

