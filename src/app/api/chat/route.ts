import { NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/openai'
import { searchTerms } from '@/data/index'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

function getFallbackResponse(messages: { role: string; content: string }[]): string {
  const lastMsg = messages[messages.length - 1]?.content || ''
  const query = lastMsg.toLowerCase().trim()
  if (!query) {
    return `Hi! I'm ExplainEasy AI. Ask me anything about business, finance, entrepreneurship, or technology concepts.`
  }

  const results = searchTerms(query).slice(0, 3)

  if (results.length === 0) {
    return `I'm sorry, I couldn't find information about "${lastMsg}" in our knowledge base right now. Try asking about a specific business concept like "gross margin", "valuation", or "burn rate".`
  }

  let response = `I found some relevant concepts from our knowledge base:\n`
  results.forEach((term, i) => {
    response += `\n**${i + 1}. ${term.name}** (${term.category})\n${term.definition}`
    if (term.example) {
      response += `\n💡 ${term.example}`
    }
    response += `\n`
  })
  response += `\nWant to learn more about any of these? Just ask!`
  return response
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`chat:${ip}`, 20, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const totalChars = messages.reduce((sum: number, m: { role: string; content: string }) => sum + (m.content?.length || 0), 0)
    if (totalChars > 10000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    try {
      const content = await generateChatResponse(messages)
      return NextResponse.json({ role: 'assistant', content })
    } catch {
      const fallback = getFallbackResponse(messages)
      return NextResponse.json({
        role: 'assistant',
        content: fallback,
        source: 'knowledge-base',
      })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
