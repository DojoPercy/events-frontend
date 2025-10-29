import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { appClient } from '@/lib/auth0'
import { sendSimpleEmail } from '@/lib/email-apps-script'
import { format } from 'date-fns'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notes } = body
    const { id } = await params

    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        customer: true,
        event: {
          include: { organization: true }
        },
        ticketType: true
      }
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Check if purchase belongs to user's organization
    if (purchase.event.organization.auth0OrgId !== session.user.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (purchase.status !== 'PENDING') {
      return NextResponse.json({ error: 'Purchase has already been processed' }, { status: 400 })
    }

    // Update purchase status to rejected
    const updatedPurchase = await prisma.purchase.update({
      where: { id },
      data: { 
        status: 'REJECTED',
        rejectionReason: notes || 'Purchase request rejected',
        approvedBy: session.user.email || session.user.name || 'Admin'
      },
      include: {
        customer: true,
        event: true,
        ticketType: true
      }
    })

    // Send HTML rejection email to buyer
    try {
      const { generateRejectionEmail } = await import('@/lib/email-templates')
      
      const htmlContent = generateRejectionEmail({
        customerName: `${purchase.firstName} ${purchase.lastName}`,
        eventTitle: purchase.event.title,
        eventDate: purchase.event.eventDate 
          ? format(new Date(purchase.event.eventDate), "MMMM d, yyyy 'at' h:mm a") 
          : 'TBD',
        ticketTypeName: purchase.ticketType.name,
        quantity: purchase.quantity,
        totalAmount: purchase.totalAmount.toString(),
        purchaseId: purchase.id,
        organizationName: purchase.event.organization.name || 'Event Team',
        rejectionReason: notes || 'We are unable to process your ticket request at this time due to capacity constraints or other event limitations.',
        customerEmail: purchase.email
      })

      await sendSimpleEmail({
        to: purchase.email,
        subject: `Ticket Request Update: ${purchase.event.title}`,
        body: htmlContent,
        isHtml: true
      })
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError)
    }

    return NextResponse.json(updatedPurchase)
  } catch (error) {
    console.error('Error rejecting purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

