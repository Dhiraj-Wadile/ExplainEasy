import { NextResponse } from 'next/server'
import { fetchAndParseConcept } from '@/lib/content-fetcher'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`terms:fetch:${ip}`, 30, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  const { searchParams } = new URL(request.url)
  const term = searchParams.get('q')
  if (!term) {
    return NextResponse.json({ error: 'Missing ?q= parameter' }, { status: 400 })
  }

  const result = await fetchAndParseConcept(term)
  return NextResponse.json(result)
}
