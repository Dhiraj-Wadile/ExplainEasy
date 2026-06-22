import { NextResponse } from 'next/server'
import { generateChatResponse, generateChatResponseStream } from '@/lib/openai'
import { searchTerms } from '@/data/index'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

function getFallbackContent(messages: { role: string; content: string }[]): string {
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

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          const aiStream = await generateChatResponseStream(messages)
          const reader = aiStream.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: new TextDecoder().decode(value) })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch {
          const fallback = getFallbackContent(messages)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: fallback, source: 'knowledge-base' })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
