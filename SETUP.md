# EventApp - Complete Setup Guide

## 🚀 Quick Start with Auth0 Bootstrap

The EventApp includes a comprehensive Auth0 bootstrap script that automatically configures your Auth0 tenant with all necessary settings.

### Prerequisites

1. **Node.js 20+** - Required for the bootstrap script
2. **Auth0 CLI** - Install from [Auth0 CLI GitHub](https://github.com/auth0/auth0-cli)
3. **PostgreSQL Database** - Set up a PostgreSQL database
4. **Google Apps Script** - For email notifications (optional for testing)

### Step 1: Install Auth0 CLI

**Windows (using Scoop):**
```powershell
scoop bucket add auth0 https://github.com/auth0/scoop-auth0-cli.git
scoop install auth0
```

**macOS (using Homebrew):**
```bash
brew tap auth0/auth0-cli && brew install auth0
```

**Linux:**
```bash
curl -sSfL https://raw.githubusercontent.com/auth0/auth0-cli/main/install.sh | sh -s -- -b /usr/local/bin
```

### Step 2: Create Auth0 Tenant

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a **new tenant** (important: use a fresh tenant)
3. Note your tenant domain (e.g., `your-tenant.auth0.com`)

### Step 3: Login to Auth0 CLI

```bash
auth0 login --scopes "update:tenant_settings,create:connections,create:client_grants,create:email_templates,update:guardian_factors"
```

**Important:** Select the NEW tenant you just created during the authorization step.

### Step 4: Run Auth0 Bootstrap

```bash
npm run auth0:bootstrap
```

This script will automatically:
- ✅ Configure tenant settings
- ✅ Create Management and Dashboard clients
- ✅ Set up roles (admin, member)
- ✅ Create Auth0 Actions for security policies
- ✅ Configure database connection
- ✅ Set up email templates
- ✅ Enable MFA factors
- ✅ Generate `.env.local` with all Auth0 credentials

### Step 5: Database Setup

1. **Install PostgreSQL** and create a database:
```sql
CREATE DATABASE eventapp;
```

2. **Update `.env.local`** with your database URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/eventapp"
```

3. **Run Prisma migrations:**
```bash
npm run db:migrate
```

### Step 6: Google Apps Script Setup (Optional)

For email notifications to work:

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Replace the default code with:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  const emailOptions = {
    to: data.to,
    subject: data.subject,
    htmlBody: generateEmailBody(data.data)
  };
  
  GmailApp.sendEmail(emailOptions.to, emailOptions.subject, '', emailOptions);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}

function generateEmailBody(data) {
  if (data.customerName) {
    // Approval email
    return `
      <h2>New Ticket Purchase Request</h2>
      <p><strong>Customer:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      <p><strong>Event:</strong> ${data.eventTitle}</p>
      <p><strong>Date:</strong> ${new Date(data.eventDate).toLocaleDateString()}</p>
      <p><strong>Ticket:</strong> ${data.ticketTypeName}</p>
      <p><strong>Quantity:</strong> ${data.quantity}</p>
      <p><strong>Total:</strong> $${data.totalAmount}</p>
      <hr>
      <p><a href="${data.approveUrl}">✅ Approve Purchase</a></p>
      <p><a href="${data.rejectUrl}">❌ Reject Purchase</a></p>
    `;
  } else {
    // Customer notification
    return `
      <h2>Ticket Purchase ${data.status === 'approved' ? 'Approved' : 'Rejected'}</h2>
      <p>Your ticket purchase for <strong>${data.eventTitle}</strong> has been ${data.status}.</p>
      <p>${data.message}</p>
    `;
  }
}
```

4. Deploy as web app with execute permissions for "Anyone"
5. Copy the web app URL to `.env.local`:
```env
APPS_SCRIPT_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

### Step 7: Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your EventApp!

## 🎯 What the Bootstrap Script Does

### Auth0 Configuration
- **Tenant Settings**: Configures friendly name and branding
- **Prompt Settings**: Enables identifier-first login
- **Clients**: Creates Management and Dashboard applications
- **Roles**: Sets up admin and member roles
- **Actions**: Configures security policies and role management
- **Connections**: Sets up database connection
- **Email Templates**: Creates verification email template
- **MFA**: Enables WebAuthn and OTP factors

### Generated Environment Variables
The script creates `.env.local` with:
```env
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_MANAGEMENT_API_DOMAIN=your-tenant.auth0.com
SESSION_ENCRYPTION_SECRET=random-generated-secret
AUTH0_CLIENT_ID=dashboard-client-id
AUTH0_CLIENT_SECRET=dashboard-client-secret
AUTH0_MANAGEMENT_CLIENT_ID=management-client-id
AUTH0_MANAGEMENT_CLIENT_SECRET=management-client-secret
AUTH0_ADMIN_ROLE_ID=admin-role-id
AUTH0_MEMBER_ROLE_ID=member-role-id
DEFAULT_CONNECTION_ID=connection-id
CUSTOM_CLAIMS_NAMESPACE=https://eventapp.com
```

## 🔧 Manual Setup (Alternative)

If you prefer manual setup or need to customize:

1. **Create Auth0 Applications**:
   - Regular Web App for Dashboard
   - Machine-to-Machine App for Management API

2. **Configure Applications**:
   - Dashboard: `http://localhost:3000/auth/callback`
   - Management: Grant Management API scopes

3. **Set up Organizations**:
   - Enable organizations in Auth0
   - Configure organization behavior

4. **Create Roles**:
   - `admin`: Full access
   - `member`: Basic access

5. **Configure Actions**:
   - Security policies
   - Role management
   - Token customization

## 🚨 Troubleshooting

### Common Issues

1. **"Auth0 CLI not found"**
   - Ensure Auth0 CLI is installed and in PATH
   - Run `auth0 --version` to verify

2. **"Node.js version too old"**
   - Update to Node.js 20 or later
   - Use `nvm` to manage versions

3. **"Failed to create client"**
   - Ensure you're logged into the correct tenant
   - Check Auth0 CLI permissions

4. **"Database connection failed"**
   - Verify PostgreSQL is running
   - Check database URL format
   - Ensure database exists

5. **"Prisma generate failed"**
   - Run `npm install` first
   - Check Prisma schema syntax

### Getting Help

- Check the [Auth0 CLI documentation](https://github.com/auth0/auth0-cli)
- Review [Auth0 Organizations guide](https://auth0.com/docs/manage-users/organizations)
- Check the EventApp README for additional setup details

## 🎉 Next Steps

After successful setup:

1. **Create your first organization** in Auth0 Dashboard
2. **Invite users** to your organization
3. **Create events** in the admin dashboard
4. **Test the public storefront** at `/live/events`
5. **Test the approval workflow** with email notifications

Your EventApp is now ready for development and testing!

