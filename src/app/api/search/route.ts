import { NextResponse } from 'next/server'
import { allTerms } from '@/data'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase()
  const q = query.toLowerCase().trim()
  if (t.includes(q)) return true

  const words = q.split(/\s+/)
  if (words.length > 1) {
    return words.every((w) => t.includes(w))
  }

  let qi = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++
  }
  if (qi === q.length) return true

  const qChars = q.split('')
  const tChars = t.split('')
  let matches = 0
  for (const c of qChars) {
    if (tChars.includes(c)) matches++
  }
  return matches / qChars.length >= 0.7
}

function scoreTerm(term: { name: string; definition: string; tags: string[]; category: string }, query: string): number {
  const q = query.toLowerCase()
  let score = 0
  if (term.name.toLowerCase().includes(q)) score += 100
  else if (fuzzyMatch(term.name, q)) score += 60
  if (term.definition.toLowerCase().includes(q)) score += 30
  else if (fuzzyMatch(term.definition, q)) score += 15
  if (term.tags.some((t) => t.toLowerCase().includes(q))) score += 20
  if (term.category.toLowerCase().includes(q)) score += 10
  return score
}

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

  const trimmed = query.trim().toLowerCase()
  const scored = allTerms
    .map((t) => ({ term: t, score: scoreTerm(t, trimmed) }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  const results = scored.map(({ term: t, score }) => ({
    slug: t.slug,
    name: t.name,
    category: t.category,
    difficulty: t.difficulty,
    definition: t.definition,
    simpleExplanation: t.simpleExplanation,
    score,
    tags: t.tags.slice(0, 3),
  }))

  const suggestion = results.length === 0 && trimmed.length > 0
    ? `Try searching for related terms like "${allTerms[Math.floor(Math.random() * allTerms.length)].name}"`
    : undefined

  return NextResponse.json({ results, total: results.length, suggestion })
}
