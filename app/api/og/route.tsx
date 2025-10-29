import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Event'
    const date = searchParams.get('date') || ''
    const location = searchParams.get('location') || ''
    const color = searchParams.get('color') || '#8B5CF6'

    console.log('[OG IMAGE] Generating with:', { title, date, location, color })

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            position: 'relative',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '400px',
              height: '400px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '500px',
              height: '500px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              filter: 'blur(80px)',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              color: 'white',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            {/* Event Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                marginBottom: '40px',
                maxWidth: '1000px',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              {title}
            </div>

            {/* Date and Location */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                fontSize: '36px',
                opacity: 0.95,
              }}
            >
              {date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>📅</span>
                  <span>{date}</span>
                </div>
              )}
              {location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>📍</span>
                  <span>{location}</span>
                </div>
              )}
            </div>

            {/* Footer branding */}
            <div
              style={{
                position: 'absolute',
                bottom: '60px',
                fontSize: '28px',
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span>✨</span>
              <span>EventApp</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('[OG IMAGE] Error generating:', error)
    // Return a simple fallback response instead of error
    return new Response('OG Image generation failed', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      }
    })
  }
}

