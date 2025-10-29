import { NextRequest, NextResponse } from 'next/server'
import { appClient, managementClient } from '@/lib/auth0'

export async function POST(request: NextRequest) {
  try {
    const session = await appClient.getSession()

    if (!session?.user?.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, role, organizationId } = body

    // Validate inputs
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (organizationId !== session.user.org_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if user is admin
    const { data: memberRoles } = await managementClient.organizations.getMemberRoles({
      id: session.user.org_id,
      user_id: session.user.sub,
    })

    const isAdmin = memberRoles.some(r => r.name === 'admin' || r.name === 'Admin')

    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can send invitations' }, { status: 403 })
    }

    // Get organization details
    const { data: org } = await managementClient.organizations.get({
      id: organizationId,
    })

    // Determine which role ID to use
    let roleIds: string[] = []
    if (role === 'admin' && process.env.AUTH0_ADMIN_ROLE_ID) {
      roleIds = [process.env.AUTH0_ADMIN_ROLE_ID]
    } else if (role === 'member' && process.env.AUTH0_MEMBER_ROLE_ID) {
      roleIds = [process.env.AUTH0_MEMBER_ROLE_ID]
    }

    // Create invitation
    const invitationData: any = {
      inviter: {
        name: session.user.name || session.user.email,
      },
      invitee: {
        email: email,
      },
      client_id: process.env.AUTH0_CLIENT_ID!,
      send_invitation_email: true,
    }

    // Only add roles if we have role IDs configured
    if (roleIds.length > 0) {
      invitationData.roles = roleIds
    }

    const { data: invitation } = await managementClient.organizations.createInvitation(
      {
        id: organizationId,
      },
      invitationData
    )

    console.log(`[INVITE] Invitation sent to ${email} for organization ${org.display_name || org.name}`)

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: email,
        organizationId: organizationId,
      },
    })
  } catch (error: any) {
    console.error('Error creating invitation:', error)
    
    // Handle specific Auth0 errors
    if (error.statusCode === 400) {
      // Check if it's the "default login route" error
      if (error.message && error.message.includes('default login route')) {
        return NextResponse.json(
          { 
            error: 'Auth0 Configuration Required: Please set the "Application Login URI" in Auth0 Dashboard. Go to Applications > Your App > Settings > Application Login URI and set it to: ' + 
                   (process.env.APP_BASE_URL || 'http://localhost:3000') + '/auth/login/invitation'
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Invalid invitation data. Please check the email address.' },
        { status: 400 }
      )
    }
    
    if (error.statusCode === 409) {
      return NextResponse.json(
        { error: 'An invitation for this email already exists or the user is already a member.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send invitation' },
      { status: 500 }
    )
  }
}

