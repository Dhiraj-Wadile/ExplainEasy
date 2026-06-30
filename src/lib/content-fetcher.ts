const SOURCE_URLS: Record<string, string[]> = {
  'Sling': ['https://getsling.com/blog/business-terms/'],
  'Workspace': ['https://www.workspace.co.uk/content-hub/business-insight/glossary-of-business-terminology'],
  'Investopedia': ['https://www.investopedia.com/terms/'],
}

interface FetchedContent {
  title: string
  snippet: string
  source: string
  url: string
  content: string
}

interface ParsedConcept {
  name: string
  slug: string
  definition: string
  simpleExplanation: string
  example: string
  whyItMatters: string
  category: string
  tags: string[]
  faqs: { question: string; answer: string }[]
  references: string[]
}

interface CacheEntry {
  data: { concept: ParsedConcept | null; source: string; cached: boolean }
  expiry: number
}

const contentCache = new Map<string, CacheEntry>()
const CACHE_TTL = 30 * 60 * 1000

async function fetchFromSources(query: string): Promise<FetchedContent[]> {
  const results: FetchedContent[] = []

  for (const [source, urls] of Object.entries(SOURCE_URLS)) {
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(5000),
          headers: { 'User-Agent': 'ExplainEasy/1.0' }
        })
        if (!response.ok) continue
        const html = await response.text()
        const text = html
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        const lowerQ = query.toLowerCase()
        if (text.toLowerCase().includes(lowerQ)) {
          const idx = text.toLowerCase().indexOf(lowerQ)
          const snippet = text.substring(Math.max(0, idx - 200), idx + 200 + query.length)
          results.push({ title: source, snippet, source, url, content: text.substring(0, 10000) })
        }
      } catch {
        continue
      }
    }
  }
  return results
}

async function fetchFromWebSearch(query: string): Promise<FetchedContent | null> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' business term definition')}&format=json&skip_disambig=1`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const data = await res.json()
    if (data.AbstractText) {
      return {
        title: data.AbstractText.split('.')[0] || query,
        snippet: data.AbstractText,
        source: data.AbstractSource || 'DuckDuckGo',
        url: data.AbstractURL || '',
        content: data.AbstractText
      }
    }
  } catch {
    // fallback
  }
  return null
}

export async function fetchAndParseConcept(termName: string): Promise<{
  concept: ParsedConcept | null
  source: string
  cached: boolean
}> {
  const cacheKey = `concept:${termName.toLowerCase().trim()}`
  const cached = contentCache.get(cacheKey)
  if (cached && Date.now() < cached.expiry) {
    return { ...cached.data, cached: true }
  }

  const [sourceResults, webResult] = await Promise.all([
    fetchFromSources(termName),
    fetchFromWebSearch(termName)
  ])

  const allContent = [
    ...(webResult ? [webResult] : []),
    ...sourceResults
  ]

  if (allContent.length === 0) {
    return {
      concept: null,
      source: 'none',
      cached: false
    }
  }

  const bestSource = allContent[0]
  const combinedText = allContent.map(s =>
    `[Source: ${s.source}] ${s.snippet}`
  ).join('\n\n')

  let parsed: ParsedConcept | null = null

  try {
    const { generateChatResponse } = await import('./openai')
    const jsonPrompt = `You extract business term information from web content and return structured JSON.
You must return valid JSON with exactly these fields:
{
  "name": "term name",
  "slug": "url-friendly-slug",
  "definition": "clear 2-3 sentence definition",
  "simpleExplanation": "one sentence even a child can understand",
  "example": "concrete real-world example",
  "whyItMatters": "why this matters in 2-3 sentences",
  "category": "one of: Finance, Marketing, Sales, Management, Technology, HR, Strategy, Business Strategy, Project Management, Product Management",
  "tags": ["3-5 relevant tags"],
  "faqs": [{"question": "...", "answer": "..."}],
  "references": ["source URLs or citations"]
}

Term to look up: "${termName}"

Content from authoritative sources:
${combinedText}

Return ONLY valid JSON for "${termName}". No markdown.`

    const text = await generateChatResponse([
      { role: 'user', content: jsonPrompt }
    ])
    if (text) {
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim()
      parsed = JSON.parse(cleaned) as ParsedConcept
    }
  } catch (err) {
    console.error('[ContentFetcher] LLM parse error:', err)
  }

  if (!parsed) {
    parsed = {
      name: termName,
      slug: termName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      definition: bestSource.snippet,
      simpleExplanation: bestSource.snippet.split('.')[0] + '.',
      example: '',
      whyItMatters: '',
      category: 'Business Strategy',
      tags: [termName.toLowerCase(), 'business-term'],
      faqs: [],
      references: [bestSource.url]
    }
  }

  const result = {
    concept: parsed,
    source: bestSource.source,
    cached: false
  }

  contentCache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL })
  return result
}
