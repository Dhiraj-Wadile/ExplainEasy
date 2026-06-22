import { NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/openai'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

const ALLOWED_TYPES = new Set(['concept', 'term', 'definition', 'idea', 'topic'])

export async function POST(request: Request) {
  const rl = await rateLimit('generate', 20, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const body = await request.json()
    const { prompt, type } = body

    if (!prompt || typeof prompt !== 'string' || prompt.length > 2000) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }

    const safeType = typeof type === 'string' && ALLOWED_TYPES.has(type) ? type : 'concept'

    const messages = [
      { role: 'user' as const, content: `Explain this ${safeType} simply: ${prompt}` },
    ]
    const content = await generateChatResponse(messages)

    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
