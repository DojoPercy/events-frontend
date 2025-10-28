interface AppsScriptEmailData {
  customerName: string
  customerEmail: string
  customerPhone?: string
  eventTitle: string
  eventDate: string
  ticketTypeName: string
  quantity: number
  totalAmount: number
  purchaseId: string
  approveUrl: string
  rejectUrl: string
}

export async function sendApprovalEmail(data: AppsScriptEmailData) {
  const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL
  
  if (!appsScriptUrl) {
    console.error('APPS_SCRIPT_WEBHOOK_URL not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'marcom@radcommgroup.com',
        subject: `New Ticket Purchase Request - ${data.eventTitle}`,
        data: data
      })
    })

    if (!response.ok) {
      throw new Error(`Apps Script request failed: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send approval email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendCustomerNotification(email: string, status: 'approved' | 'rejected', eventTitle: string) {
  const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL
  
  if (!appsScriptUrl) {
    console.error('APPS_SCRIPT_WEBHOOK_URL not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Your ticket purchase for ${eventTitle} has been ${status}`,
        data: {
          status,
          eventTitle,
          message: status === 'approved' 
            ? 'Your ticket purchase has been approved! You will receive further instructions soon.'
            : 'Unfortunately, your ticket purchase could not be approved at this time.'
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Apps Script request failed: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send customer notification:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Simple email sender with custom to, subject, and body
export async function sendSimpleEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL
  
  if (!appsScriptUrl) {
    console.error('APPS_SCRIPT_WEBHOOK_URL not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body
      })
    })

    if (!response.ok) {
      throw new Error(`Apps Script request failed: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

