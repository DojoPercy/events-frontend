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

    // Send rejection email to buyer
    try {
      await sendSimpleEmail({
        to: purchase.email,
        subject: `Update on Your Ticket Request: ${purchase.event.title}`,
        body: `Dear ${purchase.firstName} ${purchase.lastName},

We regret to inform you that your ticket request for ${purchase.event.title} has been rejected.

PURCHASE DETAILS:
- Event: ${purchase.event.title}
- Ticket Type: ${purchase.ticketType.name}
- Quantity: ${purchase.quantity}
- Total Amount: $${purchase.totalAmount}
- Purchase ID: ${purchase.id}

${notes ? `Reason: ${notes}` : 'Unfortunately, we are unable to process your request at this time.'}

VIEW YOUR PURCHASES:
Click here to view all your ticket purchase requests:
${process.env.APP_BASE_URL || 'http://localhost:3000'}/customer/purchases?email=${encodeURIComponent(purchase.email)}

If you have any questions, please contact us.

Best regards,
${purchase.event.organization.name || 'Event Team'}`
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

