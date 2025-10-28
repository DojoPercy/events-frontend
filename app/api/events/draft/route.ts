import { NextRequest, NextResponse } from 'next/server'
import { appClient, managementClient } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

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
        console.log(`[DRAFT EVENT] Fetched organization name from Auth0: ${orgName}`)
      } catch (error) {
        console.error('[DRAFT EVENT] Failed to fetch org from Auth0:', error)
      }

      organization = await prisma.organization.create({
        data: {
          auth0OrgId: session.user.org_id,
          name: orgName
        }
      })
      console.log(`[DRAFT EVENT] Created organization in DB: ${orgName}`)
    }

    const { ticketTypes, ...eventData } = body

    // Create or update draft event
    let event: { primaryColor: string | null; slug: string; id: string; venue: string | null; heroTitle: string | null; heroSubtitle: string | null; logoUrl: string | null; title: string; city: string | null; description: string | null; aboutSection: string | null; state: string | null; country: string | null; zipCode: string | null; linkedinUrl: string | null; twitterUrl: string | null; instagramUrl: string | null; website: string | null; addressLine1: string | null; createdAt: Date; updatedAt: Date; eventDate: Date; endDate: Date | null; timezone: string; location: string | null; addressLine2: string | null; latitude: number | null; longitude: number | null; placeId: string | null; imageUrl: string | null; coverImageUrl: string | null; isPublished: boolean; isDraft: boolean; secondaryColor: string | null; currency: string; taxRate: number | null; taxName: string | null; taxInclusive: boolean; organizationId: string }
    if (body.eventId) {
      // Filter out invalid fields and empty strings
      const updateData: any = {}
      Object.keys(eventData).forEach(key => {
        if (eventData[key] !== undefined && eventData[key] !== '') {
          updateData[key] = eventData[key]
        }
      })

      // Handle date fields
      if (updateData.eventDate) updateData.eventDate = new Date(updateData.eventDate)
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate)
      } else if ('endDate' in eventData && !eventData.endDate) {
        updateData.endDate = null
      }

      updateData.isDraft = true

      // Update existing draft
      event = await prisma.event.update({
        where: { id: body.eventId },
        data: updateData
      })

      // Delete old ticket types and create new ones if provided
      if (ticketTypes && ticketTypes.length > 0) {
        await prisma.ticketType.deleteMany({
          where: { eventId: body.eventId }
        })

        await prisma.ticketType.createMany({
          data: ticketTypes.map((tt: any) => ({
            eventId: body.eventId,
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
        where: { id: body.eventId },
        include: { ticketTypes: true }
      })
      return NextResponse.json(eventWithTickets)
    } else {
      // Create new draft
      const slug = eventData.title 
        ? eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
        : `event-${Date.now()}`
      
      // Helper to convert empty strings to null or undefined
      const cleanValue = (val: any) => {
        if (val === '' || val === undefined) return null
        return val
      }

      event = await prisma.event.create({
        data: {
          title: eventData.title || 'Untitled Event',
          description: cleanValue(eventData.description),
          slug,
          eventDate: eventData.eventDate ? new Date(eventData.eventDate) : new Date(),
          endDate: eventData.endDate ? new Date(eventData.endDate) : cleanValue(eventData.endDate),
          timezone: eventData.timezone || 'UTC',
          venue: cleanValue(eventData.venue),
          addressLine1: cleanValue(eventData.addressLine1),
          addressLine2: cleanValue(eventData.addressLine2),
          city: cleanValue(eventData.city),
          state: cleanValue(eventData.state),
          country: cleanValue(eventData.country),
          zipCode: cleanValue(eventData.zipCode),
          latitude: eventData.latitude,
          longitude: eventData.longitude,
          placeId: cleanValue(eventData.placeId),
          imageUrl: cleanValue(eventData.imageUrl),
          coverImageUrl: cleanValue(eventData.coverImageUrl),
          logoUrl: cleanValue(eventData.logoUrl),
          primaryColor: cleanValue(eventData.primaryColor),
          secondaryColor: cleanValue(eventData.secondaryColor),
          heroTitle: cleanValue(eventData.heroTitle),
          heroSubtitle: cleanValue(eventData.heroSubtitle),
          aboutSection: cleanValue(eventData.aboutSection),
          website: cleanValue(eventData.website),
          linkedinUrl: cleanValue(eventData.linkedinUrl),
          twitterUrl: cleanValue(eventData.twitterUrl),
          instagramUrl: cleanValue(eventData.instagramUrl),
          currency: eventData.currency || 'USD',
          taxRate: eventData.taxRate,
          taxName: cleanValue(eventData.taxName),
          taxInclusive: eventData.taxInclusive || false,
          isDraft: true,
          isPublished: false,
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
            sold: 0,
            requiresApproval: tt.requiresApproval || false,
            customNotes: tt.customNotes || '',
            maxPerOrder: tt.maxPerOrder || null
          }))
        })
      }

      // Return event with ticket types
      const eventWithTickets = await prisma.event.findUnique({
        where: { id: event.id },
        include: { ticketTypes: true }
      })
      return NextResponse.json(eventWithTickets)
    }
  } catch (error) {
    console.error('Error creating draft event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


