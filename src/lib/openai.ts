const API_KEY = process.env.OPENAI_API_KEY
const BASE_URL = 'https://opencode.ai/zen/v1'

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
        throw new Error(`API ${res.status}: ${text}`)
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

async function openaiPostStream(path: string, body: Record<string, unknown>, retries = 2) {
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
        body: JSON.stringify({ ...body, stream: true }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status}: ${text}`)
      }

      return res.body
    } catch (err) {
      lastError = err as Error
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError || new Error('OpenAI stream request failed')
}

const encoder = new TextEncoder()

export async function generateChatResponseStream(
  messages: { role: string; content: string }[]
): Promise<ReadableStream> {
  if (!messages || messages.length === 0) {
    throw new Error('Messages array cannot be empty')
  }

  const body = {
    model: 'deepseek-v4-flash-free',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ],
  }

  const upstream = await openaiPostStream('/chat/completions', body)
  if (!upstream) throw new Error('No response body from stream')

  const reader = upstream.getReader()
  const decoder = new TextDecoder()

  return new ReadableStream({
    async start(controller) {
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data: ')) continue
            const data = trimmed.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) {
                controller.enqueue(encoder.encode(content))
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (err) {
        controller.error(err)
      } finally {
        reader.releaseLock()
        controller.close()
      }
    },
  })
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
    model: 'deepseek-v4-flash-free',
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
    model: 'deepseek-v4-flash-free',
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
