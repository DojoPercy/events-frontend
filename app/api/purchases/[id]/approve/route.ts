import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { appClient } from '@/lib/auth0'
import { sendSimpleEmail } from '@/lib/email-apps-script'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await appClient.getSession()
    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Update purchase status to approved
    const updatedPurchase = await prisma.purchase.update({
      where: { id },
      data: { 
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: session.user.email || session.user.name || 'Admin'
      },
      include: {
        customer: true,
        event: true,
        ticketType: true
      }
    })

    // Update ticket type sold count
    await prisma.ticketType.update({
      where: { id: purchase.ticketTypeId },
      data: {
        sold: {
          increment: purchase.quantity
        }
      }
    })

    // Send approval email to buyer
    try {
      await sendSimpleEmail({
        to: purchase.email,
        subject: `Your Ticket Request Has Been Approved: ${purchase.event.title}`,
        body: `Dear ${purchase.firstName} ${purchase.lastName},

Great news! Your ticket request has been approved.

PURCHASE DETAILS:
- Event: ${purchase.event.title}
- Ticket Type: ${purchase.ticketType.name}
- Quantity: ${purchase.quantity}
- Total Amount: $${purchase.totalAmount}
- Purchase ID: ${purchase.id}

Your tickets have been confirmed. You will receive further details about the event soon.

VIEW YOUR PURCHASES:
Click here to view all your ticket purchases:
${process.env.APP_BASE_URL || 'http://localhost:3000'}/customer/purchases?email=${encodeURIComponent(purchase.email)}

Thank you for your purchase!

Best regards,
${purchase.event.organization.name || 'Event Team'}`
      })
    } catch (emailError) {
      console.error('Error sending approval email:', emailError)
    }

    return NextResponse.json(updatedPurchase)
  } catch (error) {
    console.error('Error approving purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

