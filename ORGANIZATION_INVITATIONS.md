# Organization Invitations Guide

This document explains how Auth0 organization invitations work in EventApp and how to configure them.

## Overview

The organization invitation system allows admins to invite new users to join their organization via email. The invited user receives an email with a link that, when clicked, guides them through signup/login and automatically adds them to the organization.

## Features Implemented

✅ **Team Members Page** (`/dashboard/organization/members`)
- View all current organization members
- See member roles (Admin vs Member)
- View pending invitations
- Admin-only access to invite button

✅ **Invitation Dialog**
- Simple email + role selection
- Sends invitation via Auth0 Management API
- Real-time feedback with toast notifications

✅ **Invitation API Endpoint** (`/api/organization/invite`)
- Server-side validation
- Admin permission check
- Auth0 Management API integration
- Error handling for duplicate invitations

✅ **Invitation Acceptance Page** (`/invitation`)
- Beautiful landing page for invitation links
- Supports both signup and login flows
- Passes invitation token to Auth0

✅ **Auth0 Integration**
- Updated auth handler to support invitation parameters
- Proper token passing to Auth0
- Automatic organization membership after login

## How It Works

### 1. Admin Sends Invitation

1. Admin navigates to `/dashboard/organization/members`
2. Clicks "Invite Member" button
3. Enters email and selects role (Member or Admin)
4. Clicks "Send Invitation"

**Behind the scenes:**
```typescript
POST /api/organization/invite
{
  "email": "newuser@company.com",
  "role": "admin", // or "member"
  "organizationId": "org_xxxxx"
}
```

The API:
- Verifies the requester is an admin
- Calls Auth0 Management API to create invitation
- Auth0 sends an email to the invitee

### 2. User Receives Email

Auth0 sends an email with a link like:
```
https://yourapp.com/invitation?invitation=inv_xxxxx&organization=org_xxxxx&organization_name=Company%20Name
```

### 3. User Clicks Invitation Link

The `/invitation` page displays a beautiful landing page with two options:
- **Accept Invitation & Sign Up** (for new users)
- **Accept Invitation & Log In** (for existing users)

### 4. User Authenticates

When the user clicks either button, they're redirected to:
```
/auth/login?invitation=inv_xxxxx&organization=org_xxxxx&returnTo=/dashboard&screen_hint=signup
```

The auth handler (`/app/auth/[auth0]/route.ts`) intercepts this and calls:
```typescript
appClient.startInteractiveLogin({
  authorizationParameters: {
    organization: "org_xxxxx",
    invitation: "inv_xxxxx",
    screen_hint: "signup" // Optional
  },
  returnTo: "/dashboard"
})
```

### 5. Auth0 Processes Invitation

- User completes signup or login
- Auth0 validates the invitation token
- Auth0 automatically adds user to the organization
- User is redirected to `/dashboard`

### 6. User Lands in Dashboard

- User is now a member of the organization
- They see all events and data for that organization
- Their role (Admin or Member) is applied

## Configuration Required

### Step 1: Set Application Login URI in Auth0

**CRITICAL:** You must configure the Application Login URI in Auth0 Dashboard.

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Navigate to **Applications** > Your Application
3. Go to the **Settings** tab
4. Find **Application Login URI**
5. Set it to: `https://yourdomain.com/invitation`
   - For local development: `http://localhost:3000/invitation`
6. Click **Save Changes**

**Why this is important:**
- Auth0 uses this URI to generate invitation links
- The invitation email will contain this URL with query parameters
- Without this, invitation emails will have broken links

### Step 2: Configure Allowed Callback URLs

Make sure your callback URLs include:

```
http://localhost:3000/auth/callback,
https://yourdomain.com/auth/callback
```

### Step 3: Verify Role IDs

In your `.env` file, ensure you have:

```env
AUTH0_ADMIN_ROLE_ID=rol_xxxxx
AUTH0_MEMBER_ROLE_ID=rol_xxxxx
```

To find these:
1. Go to Auth0 Dashboard > **User Management** > **Roles**
2. Click on a role
3. Copy the Role ID from the URL or settings

### Step 4: Grant Management API Permissions

Your Management API client needs these scopes:
- `read:organization_members`
- `read:organization_member_roles`
- `create:organization_invitations`
- `read:organization_invitations`
- `read:organizations`

## Email Customization

Auth0 sends the invitation email using their default template. To customize:

1. Go to Auth0 Dashboard > **Branding** > **Email Templates**
2. Find **Organization Invitation**
3. Customize the HTML template
4. You can use these variables:
   - `{{ url }}` - The invitation acceptance URL
   - `{{ organization.display_name }}` - Organization name
   - `{{ invitation.inviter.name }}` - Who sent the invitation

Example custom template:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .button { background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <h2>You're invited to join {{ organization.display_name }}!</h2>
  <p>{{ invitation.inviter.name }} has invited you to collaborate on EventApp.</p>
  <p>
    <a href="{{ url }}" class="button">Accept Invitation</a>
  </p>
</body>
</html>
```

## File Structure

```
events-frontend/
├── app/
│   ├── api/
│   │   └── organization/
│   │       └── invite/
│   │           └── route.ts              # API endpoint for sending invitations
│   ├── auth/
│   │   └── [auth0]/
│   │       └── route.ts                  # Updated to handle invitation params
│   ├── dashboard/
│   │   └── organization/
│   │       ├── general/
│   │       │   └── page.tsx              # Existing organization settings
│   │       └── members/
│   │           ├── page.tsx              # Team members page
│   │           └── invite-member-dialog.tsx  # Invitation dialog component
│   └── invitation/
│       └── page.tsx                      # Invitation acceptance landing page
└── components/
    └── mobile-nav.tsx                     # Updated with Team link
```

## API Reference

### POST /api/organization/invite

Send an invitation to join an organization.

**Request:**
```typescript
{
  email: string           // Email address of invitee
  role: "admin" | "member" // Role to assign
  organizationId: string  // Must match user's current org
}
```

**Response (Success):**
```typescript
{
  success: true,
  invitation: {
    id: string,
    email: string,
    organizationId: string
  }
}
```

**Response (Error):**
```typescript
{
  error: string
}
```

**Status Codes:**
- `200` - Invitation sent successfully
- `400` - Invalid email or data
- `401` - User not authenticated
- `403` - User not authorized (not an admin)
- `409` - Invitation already exists or user is already a member
- `500` - Server error

## Component Usage

### Invite Member Dialog

```tsx
import { InviteMemberDialog } from "./invite-member-dialog"

<InviteMemberDialog 
  organizationId="org_xxxxx"
  organizationName="My Company"
/>
```

## Security Considerations

1. **Admin-Only Invitations**
   - Only users with the "Admin" role can send invitations
   - This is enforced server-side in the API endpoint

2. **Organization Validation**
   - Users can only invite to their current organization
   - Prevents cross-organization invitation abuse

3. **Invitation Tokens**
   - Invitation tokens are single-use
   - They expire after a set period (configured in Auth0)
   - Tokens are validated by Auth0, not your application

4. **Email Verification**
   - Auth0 handles email verification
   - Invalid emails will fail at the Auth0 level

## Troubleshooting

### Invitation Emails Not Sending

**Check:**
1. Application Login URI is set in Auth0 Dashboard
2. Management API client has `create:organization_invitations` scope
3. Check Auth0 logs for errors

**Solution:**
- Verify environment variables are correct
- Check Auth0 Dashboard > Monitoring > Logs

### Invitation Link Broken

**Check:**
1. Application Login URI matches your deployment URL
2. `/invitation` page is accessible

**Solution:**
- Update Application Login URI in Auth0 Dashboard
- Ensure no middleware is blocking the `/invitation` route

### User Not Added to Organization

**Check:**
1. Invitation token is valid (not expired)
2. User completed the full auth flow
3. Check Auth0 Dashboard > Organizations > Members

**Solution:**
- Resend the invitation
- Check Auth0 logs for authorization errors

### "Only admins can send invitations" Error

**Check:**
1. User has the "Admin" role in the organization
2. `AUTH0_ADMIN_ROLE_ID` is correctly set

**Solution:**
- Assign Admin role in Auth0 Dashboard
- Verify role ID in environment variables

### Duplicate Invitation Error

**Scenario:** User already has a pending invitation or is already a member

**Solution:**
- Check pending invitations in the Members page
- Delete old invitation and send a new one
- Or, the user may already be a member

## Testing

### Local Development Testing

1. **Setup:**
   ```bash
   # Set Application Login URI to:
   http://localhost:3000/invitation
   ```

2. **Send Test Invitation:**
   - Login as an admin user
   - Go to `/dashboard/organization/members`
   - Click "Invite Member"
   - Enter a test email
   - Select a role
   - Click "Send Invitation"

3. **Accept Invitation:**
   - Check the email inbox
   - Click the invitation link
   - Complete signup/login
   - Verify you're added to the organization

### Production Testing

1. **Update Application Login URI:**
   ```
   https://yourdomain.com/invitation
   ```

2. **Test Full Flow:**
   - Send invitation to a real email
   - Click link from email client
   - Verify SSL/HTTPS works correctly
   - Check user appears in Members page

## Best Practices

1. **Role Assignment**
   - Start with "Member" role by default
   - Promote to "Admin" later if needed
   - Limit the number of admins

2. **Invitation Management**
   - Regularly review pending invitations
   - Delete expired or unused invitations
   - Resend if user didn't receive email

3. **User Onboarding**
   - Send a welcome message after acceptance
   - Provide guidance on next steps
   - Share relevant documentation

4. **Security**
   - Never share invitation links publicly
   - Use short expiration times
   - Monitor invitation acceptance rates

## Future Enhancements

Potential improvements to consider:

- [ ] Bulk invite (CSV upload)
- [ ] Custom invitation messages
- [ ] Invitation expiry management
- [ ] Resend invitation button
- [ ] Delete/revoke pending invitations
- [ ] Invitation analytics
- [ ] Role change after invitation sent
- [ ] Team size limits
- [ ] Invitation templates

## Support

For issues or questions:
1. Check Auth0 logs in Dashboard
2. Review server logs for API errors
3. Test with a personal email first
4. Verify all environment variables are set

---

**Last Updated:** 2025
**Auth0 SDK Version:** @auth0/nextjs-auth0 ^4.9.0

