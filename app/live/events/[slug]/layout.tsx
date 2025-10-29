import { Metadata } from 'next'

interface Event {
  id: string
  title: string
  description?: string
  slug: string
  eventDate: string | Date
  location?: string
  coverImageUrl?: string
  logoUrl?: string
  primaryColor?: string
  organization?: {
    name: string
  }
}

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/events/public/${slug}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('[METADATA] Error fetching event:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The event you are looking for could not be found.',
    }
  }

  const eventDate = new Date(event.eventDate)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const title = `${event.title} - ${formattedDate}`
  const description = event.description || `Join us for ${event.title} on ${formattedDate}${event.location ? ` at ${event.location}` : ''}.`
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/live/events/${slug}`
  
  // Use cover image or generate a branded OG image with event details
  let ogImage: string
  if (event.coverImageUrl) {
    ogImage = event.coverImageUrl
  } else {
    // Generate branded OG image with event colors
    const ogParams = new URLSearchParams({
      title: event.title,
      date: formattedDate,
    })
    if (event.location) ogParams.set('location', event.location)
    if (event.primaryColor) ogParams.set('color', event.primaryColor)
    
    ogImage = `${baseUrl}/api/og?${ogParams.toString()}`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'EventApp',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

