import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Simple in-memory rate limiter.
 * Returns null if allowed, or a 429 NextResponse if blocked.
 *
 * @param req - The incoming request
 * @param key - A namespace for this limiter (e.g. 'generate', 'admin')
 * @param maxRequests - Max requests allowed in the window
 * @param windowSeconds - Window duration in seconds
 */
export function rateLimit(
  req: NextRequest,
  key: string,
  maxRequests: number,
  windowSeconds: number
): NextResponse | null {
  const ip = getClientIP(req)
  const storeKey = `${key}:${ip}`
  const now = Date.now()

  const entry = store.get(storeKey)

  if (!entry || entry.resetAt < now) {
    store.set(storeKey, { count: 1, resetAt: now + windowSeconds * 1000 })
    return null
  }

  entry.count++

  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    )
  }

  return null
}
