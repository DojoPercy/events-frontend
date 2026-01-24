import { NextRequest, NextResponse } from 'next/server'
import { appClient, managementClient } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { createEventSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/events] Request received')
    const session = await appClient.getSession()
    
    console.log('[GET /api/events] Session:', {
      hasUser: !!session?.user,
      orgId: session?.user?.org_id
    })
    
    if (!session?.user) {
      console.log('[GET /api/events] No session user, returning 401')
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 })
    }

    if (!session.user.org_id) {
      console.log('[GET /api/events] No org_id in session, returning 401')
      return NextResponse.json({ error: 'Unauthorized - No organization' }, { status: 401 })
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
      console.log('[GET /api/events] Organization not found for org_id:', session.user.org_id)
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    console.log(`[GET /api/events] Found ${organization.events.length} events`)
    return NextResponse.json(organization.events)
  } catch (error) {
    console.error('[GET /api/events] Error fetching events:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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
      // Fetch organization name from Auth0
      let orgName = 'My Organization'
      try {
        const { data: auth0Org } = await managementClient.organizations.get({
          id: session.user.org_id
        })
        orgName = auth0Org.display_name || auth0Org.name || orgName
        console.log(`[CREATE EVENT] Fetched organization name from Auth0: ${orgName}`)
      } catch (error) {
        console.error('[CREATE EVENT] Failed to fetch org from Auth0:', error)
      }

      organization = await prisma.organization.create({
        data: {
          auth0OrgId: session.user.org_id,
          name: orgName
        }
      })
      console.log(`[CREATE EVENT] Created organization in DB: ${orgName}`)
    }

    // Generate unique slug
    let baseSlug = validatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
    let slug = baseSlug
    let counter = 1
    
    while (true) {
      const existingEvent = await prisma.event.findUnique({
        where: { slug }
      })
      
      if (!existingEvent) break
      
      slug = `${baseSlug}-${counter}`
      counter++
    }

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

