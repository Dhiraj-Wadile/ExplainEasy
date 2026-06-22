const API_KEY = process.env.OPENAI_API_KEY
const BASE_URL = 'https://api.openai.com/v1'

async function openaiPost(path: string, body: Record<string, unknown>, retries = 2) {
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`OpenAI ${res.status}: ${text}`)
      }

      return res.json()
    } catch (err) {
      lastError = err as Error
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError || new Error('OpenAI request failed')
}

const SYSTEM_PROMPT = `You are ExplainEasy AI, a friendly business knowledge assistant.
You help users understand business, finance, entrepreneurship, and marketing concepts in simple terms.
Keep explanations clear, concise, and beginner-friendly.
Use real-world examples when helpful.
If you don't know something, say so honestly.`

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  if (!messages || messages.length === 0) {
    throw new Error('Messages array cannot be empty')
  }

  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ],
  }

  const data = await openaiPost('/chat/completions', body)
  return data.choices?.[0]?.message?.content || ''
}

const THOUGHT_FALLBACK = {
  text: "The best way to predict the future is to create it. Every great business starts with a decision to solve a real problem.",
  author: "Peter Drucker",
  role: "Management Consultant",
  company: "Drucker Institute",
}

export async function generateThought(): Promise<{
  text: string
  author: string
  role: string
  company: string
}> {
  if (!API_KEY) {
    return THOUGHT_FALLBACK
  }

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You generate inspiring, original business and entrepreneurship thoughts in the style of famous entrepreneurs. Each thought must be concise (1-3 sentences), profound, and attribution-ready.',
      },
      {
        role: 'user',
        content:
          'Generate an original business/entrepreneurship thought that sounds like it could come from a famous entrepreneur. Return ONLY valid JSON with this exact shape: { "text": "the thought", "author": "Attributed Name", "role": "Founder & CEO", "company": "CompanyName" }. Make the thought fresh, not a cliché.',
      },
    ],
  }

  try {
    const data = await openaiPost('/chat/completions', body)
    const text = data.choices?.[0]?.message?.content || ''
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim()
    const parsed = JSON.parse(cleaned)
    if (parsed.text && parsed.author) {
      return parsed
    }
    return THOUGHT_FALLBACK
  } catch {
    return THOUGHT_FALLBACK
  }
}
