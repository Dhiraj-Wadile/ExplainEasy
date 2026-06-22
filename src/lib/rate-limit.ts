import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function createRatelimit() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(30, '60s'),
      analytics: true,
      prefix: 'ratelimit',
    })
  }

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(30, '60s'),
      analytics: true,
      prefix: 'ratelimit',
    })
  }

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    const rateMap = new Map<string, { count: number; resetAt: number }>()

    return {
      limit: async (key: string) => {
        const now = Date.now()
        const entry = rateMap.get(key)

        if (!entry || now > entry.resetAt) {
          rateMap.set(key, { count: 1, resetAt: now + 60000 })
          return { success: true, remaining: 29, reset: now + 60000 }
        }

        if (entry.count >= 30) {
          return { success: false, remaining: 0, reset: entry.resetAt }
        }

        entry.count++
        return { success: true, remaining: 30 - entry.count, reset: entry.resetAt }
      },
    }
  }

  console.warn('[RATE-LIMIT] No Redis/KV configured. Rate limiting disabled in production.')

  return {
    limit: async () => ({ success: true, remaining: 999, reset: Date.now() + 60000 }),
  }
}

const ratelimit = createRatelimit()

export async function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  if (limit !== 30 || windowMs !== 60_000) {
    return { allowed: true }
  }

  const result = await ratelimit.limit(key)
  return { allowed: result.success, retryAfter: Math.ceil((result.reset - Date.now()) / 1000) }
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) },
    }
  )
}
