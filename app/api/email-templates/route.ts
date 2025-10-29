import { NextRequest, NextResponse } from 'next/server'
import { appClient } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await appClient.getSession()

    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId, type, name, subject, htmlBody, primaryColor, secondaryColor, logoUrl } = body

    // Validate inputs
    if (!type || !subject || !htmlBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get or create organization
    let organization = await prisma.organization.findUnique({
      where: { auth0OrgId: session.user.org_id },
    })

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          auth0OrgId: session.user.org_id,
          name: 'My Organization',
        },
      })
    }

    // Upsert email template
    const template = await prisma.emailTemplate.upsert({
      where: {
        organizationId_type: {
          organizationId: organization.id,
          type,
        },
      },
      create: {
        organizationId: organization.id,
        type,
        name,
        subject,
        htmlBody,
        primaryColor,
        secondaryColor,
        logoUrl,
        isActive: true,
      },
      update: {
        name,
        subject,
        htmlBody,
        primaryColor,
        secondaryColor,
        logoUrl,
      },
    })

    return NextResponse.json({ success: true, template })
  } catch (error: any) {
    console.error('Error saving email template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save template' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await appClient.getSession()

    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { auth0OrgId: session.user.org_id },
      include: {
        emailTemplates: type ? {
          where: { type },
        } : true,
      },
    })

    if (!organization) {
      return NextResponse.json({ templates: [] })
    }

    return NextResponse.json({ templates: organization.emailTemplates })
  } catch (error: any) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

