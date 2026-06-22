import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimits = new Map<string, Ratelimit>()

function getRedisRatelimit(limit: number, windowMs: number) {
  const key = `${limit}:${windowMs}`
  if (ratelimits.has(key)) return ratelimits.get(key)!
  const seconds = Math.max(Math.floor(windowMs / 1000), 1)
  const rl = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, `${seconds}s`),
    analytics: true,
    prefix: 'ratelimit',
  })
  ratelimits.set(key, rl)
  return rl
}

const isDev = process.env.NODE_ENV === 'development'

function getDevRatelimit(limit: number, windowMs: number) {
  const rateMap = new Map<string, { count: number; resetAt: number }>()
  return {
    limit: async (key: string) => {
      const now = Date.now()
      const entry = rateMap.get(key)
      if (!entry || now > entry.resetAt) {
        rateMap.set(key, { count: 1, resetAt: now + windowMs })
        return { success: true, remaining: limit - 1, reset: now + windowMs }
      }
      if (entry.count >= limit) {
        return { success: false, remaining: 0, reset: entry.resetAt }
      }
      entry.count++
      return { success: true, remaining: limit - entry.count, reset: entry.resetAt }
    },
  }
}

const hasRedis =
  (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
  (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)

export async function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  let limiter: { limit: (key: string) => Promise<{ success: boolean; remaining: number; reset: number }> }

  if (hasRedis) {
    limiter = getRedisRatelimit(limit, windowMs)
  } else if (isDev) {
    limiter = getDevRatelimit(limit, windowMs)
  } else {
    console.warn('[RATE-LIMIT] No Redis/KV configured. Rate limiting disabled in production.')
    const dummy = Date.now() + 60000
    limiter = { limit: async () => ({ success: true, remaining: 999, reset: dummy }) }
  }

  const result = await limiter.limit(key)
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
