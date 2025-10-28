import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint - fetches purchases by customer email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Fetch all purchases for this customer email
    const purchases = await prisma.purchase.findMany({
      where: {
        email: email
      },
      include: {
        customer: true,
        event: {
          include: {
            organization: {
              select: {
                name: true
              }
            }
          }
        },
        ticketType: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Error fetching customer purchases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

