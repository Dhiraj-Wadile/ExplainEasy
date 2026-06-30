import { NextResponse } from 'next/server'
import { generateChatResponseStream } from '@/lib/openai'
import { getTermBySlug, allTerms } from '@/data/index'
import type { Concept } from '@/types'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

const RAG_CACHE = new Map<string, { content: string; concepts: string[]; ttl: number }>()
const CACHE_TTL = 30_000

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function buildQueryNGrams(query: string): string[] {
  const tokens = tokenize(query)
  const ngrams = new Set<string>()
  tokens.forEach((t) => {
    ngrams.add(t)
    if (t.length > 3) {
      for (let i = 2; i <= t.length; i++) {
        ngrams.add(t.slice(0, i))
      }
    }
  })
  tokens.forEach((t, i) => {
    if (i < tokens.length - 1) ngrams.add(`${t} ${tokens[i + 1]}`)
  })
  return [...ngrams]
}

function scoreRelevance(concept: Concept, queryNGrams: string[], queryLower: string): number {
  let score = 0
  const nameLower = concept.name.toLowerCase()
  const defLower = concept.definition.toLowerCase()
  const simpleLower = concept.simpleExplanation.toLowerCase()
  const exampleLower = (concept.example || '').toLowerCase()
  const whyLower = (concept.whyItMatters || '').toLowerCase()

  // Exact match on name (highest weight)
  if (nameLower === queryLower) score += 50
  else if (nameLower.includes(queryLower)) score += 30

  // Token-level name matching
  const nameTokens = tokenize(nameLower)
  const queryTokens = tokenize(queryLower)
  const matchCount = queryTokens.filter((qt) => nameTokens.some((nt) => nt === qt || nt.startsWith(qt) || qt.startsWith(nt))).length
  if (queryTokens.length > 0) {
    score += (matchCount / queryTokens.length) * 20
  }

  // Tag matching
  for (const tag of concept.tags) {
    const tagLower = tag.toLowerCase()
    for (const q of queryTokens) {
      if (tagLower === q) score += 12
      else if (tagLower.includes(q) || q.includes(tagLower)) score += 6
    }
  }

  // Category matching
  if (concept.category.toLowerCase().includes(queryLower)) score += 8
  for (const q of queryTokens) {
    if (concept.category.toLowerCase().includes(q)) score += 4
  }

  // Simple explanation matching
  if (simpleLower.includes(queryLower)) score += 6
  for (const q of queryTokens) {
    if (simpleLower.includes(q)) score += 2
  }

  // Definition matching
  if (defLower.includes(queryLower)) score += 4
  for (const q of queryTokens) {
    if (defLower.includes(q)) score += 1
  }

  // Related terms matching
  for (const rt of concept.relatedTerms) {
    const rtLower = rt.toLowerCase()
    for (const q of queryTokens) {
      if (rtLower.includes(q)) score += 3
    }
  }

  // Example context matching
  if (exampleLower.includes(queryLower)) score += 3
  if (whyLower.includes(queryLower)) score += 3

  // FAQ matching
  if (concept.faqs) {
    for (const faq of concept.faqs) {
      const qLower = faq.question.toLowerCase()
      const aLower = faq.answer.toLowerCase()
      if (qLower.includes(queryLower) || aLower.includes(queryLower)) score += 5
      for (const q of queryTokens) {
        if (qLower.includes(q) || aLower.includes(q)) score += 2
      }
    }
  }

  // N-gram matching for fuzzy relevance
  for (const ng of queryNGrams) {
    if (nameLower.includes(ng)) score += 5
    if (simpleLower.includes(ng)) score += 2
    if (defLower.includes(ng)) score += 1
  }

  return score
}

function buildRagContext(query: string): { content: string; concepts: string[] } {
  if (!query) return { content: '', concepts: [] }

  const cacheKey = query.toLowerCase().trim()
  const cached = RAG_CACHE.get(cacheKey)
  if (cached && Date.now() < cached.ttl) {
    return { content: cached.content, concepts: cached.concepts }
  }

  const queryLower = query.toLowerCase().trim()
  const queryNGrams = buildQueryNGrams(queryLower)

  const scored = allTerms
    .map((c) => ({ concept: c, score: scoreRelevance(c, queryNGrams, queryLower) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  if (scored.length === 0) {
    RAG_CACHE.set(cacheKey, { content: '', concepts: [], ttl: Date.now() + CACHE_TTL })
    return { content: '', concepts: [] }
  }

  const parts = scored.map(
    ({ concept: c }, i) =>
      `[${i + 1}] ${c.name} (${c.category})\n   ${c.definition}\n   💡 ${c.simpleExplanation}${c.example ? `\n   📌 Example: ${c.example.slice(0, 200)}` : ''}${c.whyItMatters ? `\n   🎯 Why it matters: ${c.whyItMatters.slice(0, 150)}` : ''}`
  )

  const result = {
    content: `Relevant concepts from our knowledge base:\n${parts.join('\n\n')}`,
    concepts: scored.map((s) => s.concept.slug),
  }

  RAG_CACHE.set(cacheKey, { ...result, ttl: Date.now() + CACHE_TTL })

  return result
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
        let resp = `${concept.name} simplified:\n\n${fullConcept.simpleExplanation}`
        if (fullConcept.example) resp += `\n\n💡 Example: ${fullConcept.example}`
        if (fullConcept.quickSummary) resp += `\n\n📌 Quick summary: ${fullConcept.quickSummary}`
        return resp
      }
      if (q.includes('example') || q.includes('instance') || q.includes('real')) {
        let resp = `${concept.name} examples:\n\n`
        if (fullConcept.example) resp += `• ${fullConcept.example}\n`
        if (fullConcept.realCompanyExample) resp += `• Real company: ${fullConcept.realCompanyExample}\n`
        if (fullConcept.sharkTankExample) resp += `• Shark Tank: ${fullConcept.sharkTankExample}\n`
        return resp || `${concept.name} — ${fullConcept.simpleExplanation}`
      }
      if (q.includes('compare') || q.includes('vs') || q.includes('versus') || q.includes('difference')) {
        const related = fullConcept.relatedTerms?.slice(0, 3).map((slug) => getTermBySlug(slug)).filter(Boolean)
        if (related?.length) {
          let resp = `${concept.name} compared with related terms:\n`
          related.forEach((t) => {
            if (t) resp += `\n• ${t.name}: ${t.definition}`
          })
          return resp
        }
        return `${concept.name} — ${concept.category}. Related: ${fullConcept.relatedTerms?.join(', ') || 'none listed'}.`
      }
      if (q.includes('use case') || q.includes('application') || q.includes('apply') || q.includes('use')) {
        let resp = `${concept.name} — why it matters:\n\n${fullConcept.whyItMatters || fullConcept.simpleExplanation}`
        if (fullConcept.commonMistakes?.length) {
          resp += `\n\n⚠️ Common mistakes:\n${fullConcept.commonMistakes.map((m) => `• ${m}`).join('\n')}`
        }
        if (fullConcept.interviewQuestions?.length) {
          resp += `\n\n📋 Interview questions:\n${fullConcept.interviewQuestions.slice(0, 3).map((q) => `• ${q}`).join('\n')}`
        }
        return resp
      }
      if (q.includes('interview') || q.includes('question') || q.includes('prepare')) {
        if (fullConcept.interviewQuestions?.length) {
          return `${concept.name} — interview questions:\n\n${fullConcept.interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
        }
        return `${concept.name} — no interview questions available. Ask me for an explanation instead.`
      }
      if (q.includes('mistake') || q.includes('pitfall') || q.includes('wrong') || q.includes('common')) {
        if (fullConcept.commonMistakes?.length) {
          return `${concept.name} — common mistakes:\n\n${fullConcept.commonMistakes.map((m) => `⚠️ ${m}`).join('\n')}`
        }
        return `${concept.name} — no common mistakes listed. Ask for a simplified explanation.`
      }
      return `${concept.name} (${concept.category})\n\n${fullConcept.definition}\n\n💡 ${fullConcept.simpleExplanation}\n\nAsk me to simplify, give examples, compare, or see interview questions.`
    }
  }

  if (!query) {
    return `Hi! I'm ExplainEasy AI. Ask me about business, finance, startup, or tech concepts.`
  }

  const rag = buildRagContext(query)
  if (rag.content && rag.concepts.length > 0) {
    const top = rag.concepts.slice(0, 3)
    const lines = top.map((slug) => {
      const c = getTermBySlug(slug)
      if (!c) return ''
      return `• ${c.name} — ${c.definition}`
    }).filter(Boolean)
    return `Based on our knowledge base:\n\n${lines.join('\n')}\n\nWant to dive deeper into any of these?`
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
Interview questions: ${conceptData.interviewQuestions?.slice(0, 3).join(' | ') || 'N/A'}
Related: ${conceptData.relatedTerms?.join(', ') || 'N/A'}
Tags: ${conceptData.tags?.join(', ') || 'N/A'}

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
