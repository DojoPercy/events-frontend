import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('[PUBLIC EVENT API] Fetching event with slug:', slug)
    
    // Fetch event by slug (public access)
    // Check for published events OR events that are not drafts
    const event = await prisma.event.findFirst({
      where: { 
        slug: slug,
        OR: [
          { isPublished: true },
          { isDraft: false }
        ]
      },
      include: {
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        },
        organization: {
          select: {
            name: true
          }
        }
      }
    })

    if (!event) {
      console.log('[PUBLIC EVENT API] Event not found with slug:', slug)
      
      // Debug: Check if event exists at all
      const anyEvent = await prisma.event.findFirst({
        where: { slug: slug },
        select: { id: true, isPublished: true, isDraft: true, title: true }
      })
      
      if (anyEvent) {
        console.log('[PUBLIC EVENT API] Event exists but not published:', anyEvent)
      }
      
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    console.log('[PUBLIC EVENT API] Event found:', event.id, event.title)
    return NextResponse.json(event)
  } catch (error) {
    console.error('[PUBLIC EVENT API] Error fetching public event:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

