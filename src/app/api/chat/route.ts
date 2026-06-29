import { NextResponse } from 'next/server'
import { generateChatResponseStream } from '@/lib/openai'
import { searchTerms, getTermBySlug, allTerms } from '@/data/index'
import type { Concept } from '@/types'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

function scoreRelevance(concept: Concept, query: string): number {
  const q = query.toLowerCase()
  let score = 0
  const nameLower = concept.name.toLowerCase()
  const defLower = concept.definition.toLowerCase()
  const simplifiedLower = concept.simpleExplanation.toLowerCase()

  if (nameLower === q) score += 20
  else if (nameLower.includes(q)) score += 12

  concept.tags.forEach((tag) => {
    if (tag.toLowerCase().includes(q)) score += 8
  })

  if (simplifiedLower.includes(q)) score += 5
  if (defLower.includes(q)) score += 3

  concept.relatedTerms.forEach((rt) => {
    if (rt.toLowerCase().includes(q)) score += 2
  })

  if (concept.category.toLowerCase().includes(q)) score += 2
  if (concept.faqs?.some((faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q))) score += 4

  return score
}

function buildRagContext(query: string): { content: string; concepts: string[] } {
  if (!query) return { content: '', concepts: [] }

  const scored = allTerms
    .map((c) => ({ concept: c, score: scoreRelevance(c, query) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  if (scored.length === 0) return { content: '', concepts: [] }

  const parts = scored.map(
    ({ concept: c, score }, i) =>
      `[${i + 1}] ${c.name} (${c.category}) — relevance: ${score}\n   ${c.definition}\n   💡 ${c.simpleExplanation}`
  )

  return {
    content: `Relevant concepts from our knowledge base:\n${parts.join('\n\n')}`,
    concepts: scored.map((s) => s.concept.slug),
  }
}

function getFallbackContent(
  messages: { role: string; content: string }[],
  concept?: { name: string; slug: string; definition: string; category: string }
): string {
  const lastMsg = messages[messages.length - 1]?.content || ''
  const query = lastMsg.toLowerCase().trim()

  if (concept) {
    const fullConcept = getTermBySlug(concept.slug)
    if (fullConcept) {
      const q = query
      if (q.includes('simplif') || q.includes('simple') || q.includes('easy')) {
        return `${concept.name} simplified:\n\n${fullConcept.simpleExplanation}${fullConcept.example ? `\n\n💡 Example: ${fullConcept.example}` : ''}`
      }
      if (q.includes('example') || q.includes('instance') || q.includes('real')) {
        return `${concept.name} example:\n\n${fullConcept.example || fullConcept.realCompanyExample || fullConcept.simpleExplanation}`
      }
      if (q.includes('compare') || q.includes('vs') || q.includes('versus') || q.includes('difference')) {
        const related = fullConcept.relatedTerms?.slice(0, 3).map((slug) => getTermBySlug(slug)).filter(Boolean)
        if (related?.length) {
          let resp = `${concept.name} — related terms:\n`
          related.forEach((t) => {
            if (t) resp += `\n• ${t.name}: ${t.definition}`
          })
          return resp
        }
        return `${concept.name} — ${concept.category}. Related: ${fullConcept.relatedTerms?.join(', ') || 'none listed'}.`
      }
      if (q.includes('use case') || q.includes('application') || q.includes('apply') || q.includes('use')) {
        let resp = `${concept.name} use cases:\n\n${fullConcept.whyItMatters}`
        if (fullConcept.commonMistakes?.length) {
          resp += `\n\n⚠️ Common mistakes:\n${fullConcept.commonMistakes.map((m) => `• ${m}`).join('\n')}`
        }
        return resp
      }
      return `${concept.name} (${concept.category})\n\n${fullConcept.definition}\n\n💡 ${fullConcept.simpleExplanation}\n\nAsk me to simplify, give examples, or compare with related concepts.`
    }
  }

  if (!query) {
    return `Hi! I'm ExplainEasy AI. Ask me about business, finance, startup, or tech concepts.`
  }

  const rag = buildRagContext(query)
  if (rag.content) {
    return `Based on our knowledge base:\n\n${rag.concepts.map((slug) => {
      const c = getTermBySlug(slug)
      if (!c) return ''
      return `• ${c.name} — ${c.definition}`
    }).filter(Boolean).join('\n')}\n\nWant to dive deeper into any of these?`
  }

  return `I couldn't find "${lastMsg}" in our knowledge base. Try a different term like gross margin, valuation, or burn rate.`
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`chat:${ip}`, 30, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const { messages, concept } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const totalChars = messages.reduce((sum: number, m: { role: string; content: string }) => sum + (m.content?.length || 0), 0)
    if (totalChars > 10000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || ''

    let raged = false
    if (concept) {
      const conceptData = getTermBySlug(concept.slug)
      if (conceptData) {
        const contextMsg = {
          role: 'system' as const,
          content: `The user is learning about ${conceptData.name} (${conceptData.category}).

Definition: ${conceptData.definition}
Simple explanation: ${conceptData.simpleExplanation}
Example: ${conceptData.example || 'N/A'}
Why it matters: ${conceptData.whyItMatters || 'N/A'}
Common mistakes: ${conceptData.commonMistakes?.join(', ') || 'N/A'}
Related: ${conceptData.relatedTerms?.join(', ') || 'N/A'}

Use this data to answer accurately. Short, direct responses.`
        }
        messages.unshift(contextMsg)
        raged = true
      }
    }

    if (!raged && lastUserMsg) {
      const rag = buildRagContext(lastUserMsg)
      if (rag.content) {
        messages.unshift({
          role: 'system' as const,
          content: `Here are relevant concepts from our knowledge base for context:\n${rag.content}\n\nUse these to ground your answer. If none are relevant, rely on your own knowledge. Keep responses short and direct.`
        })
      }
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
          const fallback = getFallbackContent(messages, concept)
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
