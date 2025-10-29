'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GLOBAL ERROR]', error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '32rem',
            width: '100%',
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Application Error
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.375rem',
                backgroundColor: '#f3f4f6',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                overflowX: 'auto'
              }}>
                <p style={{ color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Error details:
                </p>
                <p>{error.message}</p>
                {error.digest && (
                  <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}


