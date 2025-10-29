import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasAuth0Domain: !!process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
        hasAuth0ClientId: !!process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        hasAuth0Secret: !!process.env.AUTH0_CLIENT_SECRET,
        hasManagementClientId: !!process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        hasManagementSecret: !!process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
        hasUploadthingSecret: !!process.env.UPLOADTHING_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
      version: '1.0.0',
    }
    
    return NextResponse.json(checks, { status: 200 })
  } catch (error) {
    console.error('[HEALTH CHECK] Error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: 'disconnected',
    }, { status: 503 })
  }
}

