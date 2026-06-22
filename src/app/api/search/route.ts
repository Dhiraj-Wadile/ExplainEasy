import { NextResponse } from 'next/server'
import { searchTerms } from '@/data'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`search:${ip}`, 60, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] })
  }

  if (query.length > 200) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 })
  }

  const results = searchTerms(query.trim()).map((t) => ({
    slug: t.slug,
    name: t.name,
    category: t.category,
    definition: t.definition,
  }))

  return NextResponse.json({ results })
}
