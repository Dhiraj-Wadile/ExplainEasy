import { NextResponse } from 'next/server'
import { generateThought } from '@/lib/openai'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`thought:${ip}`, 10, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const thought = await generateThought()
    return NextResponse.json(thought)
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate thought' },
      { status: 500 }
    )
  }
}
