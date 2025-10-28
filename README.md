# EventApp - Event Management & Ticketing Platform

A professional B2B SaaS event management and ticketing platform built with Next.js, Auth0, and PostgreSQL. Features an approval workflow with email notifications via Google Apps Script.

## Features

### Admin Portal (`/dashboard`)
- **Auth0 Authentication**: Secure organization-based authentication
- **Event Management**: Create, edit, and manage events with multiple ticket types
- **Purchase Approval**: Review and approve/reject ticket purchase requests
- **Organization Management**: Multi-tenant support with organization switching

### Public Storefront (`/live/events`)
- **Event Discovery**: Browse published events without authentication
- **Ticket Purchase**: Select tickets and submit purchase requests
- **Email Validation**: Unique email per event to prevent duplicate purchases
- **Confirmation Flow**: Clear purchase confirmation with approval status

### Approval System
- **Email Notifications**: Automatic emails to marcom@radcommgroup.com for new purchases
- **Admin Interface**: Dashboard to approve/reject purchases with notes
- **Customer Notifications**: Email confirmations when purchases are approved/rejected
- **Google Apps Script Integration**: Flexible email system using Apps Script

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Authentication**: Auth0 with organization support
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Google Apps Script for notifications
- **Forms**: React Hook Form with Zod validation

## Setup Instructions

### 1. Prerequisites

- Node.js 20+ 
- PostgreSQL database
- Auth0 account
- Google Apps Script setup

### 2. Environment Variables

Create a `.env` file in the `events-frontend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eventapp"

# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN="your-domain.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
AUTH0_MANAGEMENT_API_DOMAIN="your-domain.auth0.com"
AUTH0_MANAGEMENT_CLIENT_ID="your-management-client-id"
AUTH0_MANAGEMENT_CLIENT_SECRET="your-management-client-secret"

# Session Configuration
APP_BASE_URL="http://localhost:3000"
SESSION_ENCRYPTION_SECRET="your-session-secret"

# Apps Script Email Integration
APPS_SCRIPT_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Auth0 Setup

1. Create a new Auth0 tenant
2. Create a Regular Web Application
3. Create a Machine-to-Machine Application for Management API
4. Configure the applications with the appropriate URLs and scopes
5. Set up organizations and roles as needed

### 5. Google Apps Script Setup

Create a Google Apps Script with the following function:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  // Send email using Gmail API
  const emailOptions = {
    to: data.to,
    subject: data.subject,
    htmlBody: generateEmailBody(data.data)
  };
  
  GmailApp.sendEmail(emailOptions.to, emailOptions.subject, '', emailOptions);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}

function generateEmailBody(data) {
  // Generate HTML email body based on data
  // This should include customer details, event info, and approve/reject links
}
```

### 6. Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
events-frontend/
├── app/
│   ├── dashboard/           # Admin portal (Auth0 protected)
│   │   ├── events/         # Event management
│   │   ├── purchases/      # Purchase approval
│   │   └── organization/   # Org settings
│   ├── live/
│   │   └── events/         # Public storefront
│   └── api/                # API routes
├── components/
│   └── ui/                 # Radix UI components
├── lib/
│   ├── auth0.ts           # Auth0 configuration
│   ├── prisma.ts          # Database client
│   ├── validation.ts      # Zod schemas
│   └── email-apps-script.ts # Email integration
└── prisma/
    └── schema.prisma      # Database schema
```

## Key Features Implementation

### Email Uniqueness Validation
- Each email can only purchase once per event
- Validation happens at the API level before creating purchase records

### Approval Workflow
1. Customer submits purchase request
2. System sends email to marcom@radcommgroup.com with purchase details
3. Admin reviews and approves/rejects via dashboard or email links
4. Customer receives confirmation email with status

### Multi-tenant Architecture
- Organizations are managed through Auth0
- Each organization can create and manage their own events
- Users can belong to multiple organizations

## API Endpoints

- `GET/POST /api/events` - Event management
- `GET/PUT/DELETE /api/events/[id]` - Individual event operations
- `POST /api/events/[eventId]/ticket-types` - Ticket type management
- `GET/POST /api/purchases` - Purchase management
- `POST /api/purchases/[id]/approve` - Approve purchase
- `POST /api/purchases/[id]/reject` - Reject purchase

## Development Notes

- All forms use React Hook Form with Zod validation
- Database operations use Prisma ORM
- Authentication is handled by Auth0 middleware
- Email notifications are sent via Google Apps Script
- UI components are built with Radix UI and styled with Tailwind CSS

## License

This project is built for internal use. Please ensure proper licensing for any third-party components used.