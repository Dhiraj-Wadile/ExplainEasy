import { NextResponse } from 'next/server'
import { allTerms } from '@/data'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase()
  const q = query.toLowerCase().trim()
  if (t.includes(q)) return true
  const words = q.split(/\s+/)
  if (words.length > 1) return words.every((w) => t.includes(w))
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

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`search-web:${ip}`, 60, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] })
  }

  if (query.length > 200) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.com'
  const q = query.trim().toLowerCase()
  const results: { title: string; url: string; snippet: string; source: string }[] = []

  // 1. Internal results from ExplainEasy concepts
  const internalMatches = allTerms
    .filter(
      (t) =>
        fuzzyMatch(t.name, q) ||
        fuzzyMatch(t.definition, q) ||
        fuzzyMatch(t.simpleExplanation, q) ||
        t.tags.some((tag) => fuzzyMatch(tag, q))
    )
    .slice(0, 5)

  for (const match of internalMatches) {
    results.push({
      title: `${match.name} - ExplainEasy`,
      url: `${baseUrl}/terms/${match.slug}`,
      snippet: match.simpleExplanation || match.definition.substring(0, 180),
      source: 'ExplainEasy',
    })
  }

  // 2. Try Wikipedia API
  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    const wikiRes = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'ExplainEasy/1.0 (educational project)' },
      signal: AbortSignal.timeout(3000),
    })
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json()
      if (wikiData.title && wikiData.extract && !results.some(r => r.title.includes(wikiData.title))) {
        results.push({
          title: `${wikiData.title} - Wikipedia`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiData.title.replace(/\s+/g, '_'))}`,
          snippet: wikiData.extract.substring(0, 250),
          source: 'Wikipedia',
        })
      }
    }
  } catch {
    // Wikipedia unavailable
  }

  // 3. DuckDuckGo web search
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' concept explanation')}`
    const ddgRes = await fetch(ddgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ExplainEasy/1.0; +https://explaineasy.com)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(4000),
    })

    if (ddgRes.ok) {
      const html = await ddgRes.text()
      const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
      let match
      let count = 0
      const existingUrls = new Set(results.map(r => r.url))

      while ((match = resultRegex.exec(html)) !== null && count < 5) {
        const url = match[1].replace(/\/\/html\.duckduckgo\.com\/redirect\?[^&]*&uddg=/, '').split('&')[0]
        const decodedUrl = decodeURIComponent(url)
        const title = match[2].replace(/<[^>]*>/g, '').trim()
        const snippet = match[3].replace(/<[^>]*>/g, '').trim()

        if (
          title &&
          decodedUrl &&
          !decodedUrl.includes('duckduckgo.com') &&
          !existingUrls.has(decodedUrl) &&
          !results.some(r => r.url === decodedUrl)
        ) {
          results.push({
            title,
            url: decodedUrl,
            snippet: snippet.substring(0, 200),
            source: 'Web',
          })
          existingUrls.add(decodedUrl)
          count++
        }
      }
    }
  } catch {
    // Web search unavailable
  }

  return NextResponse.json({
    results: results.slice(0, 8),
    total: results.length,
    query: q,
  })
}
