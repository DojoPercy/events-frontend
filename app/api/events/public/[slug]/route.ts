import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Fetch published event by slug (public access)
    const event = await prisma.event.findUnique({
      where: { 
        slug: slug,
        isPublished: true,
        isDraft: false,
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
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching public event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

