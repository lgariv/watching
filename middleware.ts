import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limit configuration
const RATE_LIMIT_REQUESTS = 5 // Number of requests allowed
const RATE_LIMIT_WINDOW = 60 * 60 // Time window in seconds (1 hour)

// In-memory store for rate limiting
// Note: For production, use Redis or similar for distributed systems
const rateLimit = new Map<string, { count: number; timestamp: number }>()

export function middleware(request: NextRequest) {
  // Skip rate limiting if not in production
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  // Only apply rate limiting to the AI recommendations endpoint
  if (request.nextUrl.pathname === '/api/ai-recommendations') {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
    const now = Math.floor(Date.now() / 1000)
    
    // Get existing rate limit data
    const rateLimitData = rateLimit.get(ip)
    
    if (rateLimitData) {
      // Reset count if outside time window
      if (now - rateLimitData.timestamp >= RATE_LIMIT_WINDOW) {
        rateLimit.set(ip, { count: 1, timestamp: now })
        return NextResponse.next()
      }
      
      // Increment count if within limits
      if (rateLimitData.count < RATE_LIMIT_REQUESTS) {
        rateLimit.set(ip, { count: rateLimitData.count + 1, timestamp: rateLimitData.timestamp })
        return NextResponse.next()
      }
      
      // Rate limit exceeded
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    // First request from this IP
    rateLimit.set(ip, { count: 1, timestamp: now })
  }
  
  return NextResponse.next()
}

// Configure middleware to only run on the AI recommendations endpoint
export const config = {
  matcher: '/api/ai-recommendations'
}