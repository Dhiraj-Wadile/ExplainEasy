import { NextResponse } from 'next/server'
import { generateThought } from '@/lib/openai'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

const THOUGHT_CACHE: {
  thoughts: { text: string; author: string; role: string; company: string }[]
  lastRefreshed: number
  cursor: number
} = {
  thoughts: [],
  lastRefreshed: 0,
  cursor: 0,
}

const CACHE_REFRESH_MS = 300_000
const MAX_CACHED = 10

const LOCAL_THOUGHTS = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", role: "Management Consultant", company: "Drucker Institute" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", role: "Co-Founder & CEO", company: "Apple" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates", role: "Co-Founder", company: "Microsoft" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg", role: "Co-Founder & CEO", company: "Facebook" },
  { text: "Success is not about how much money you make. It's about the difference you make in people's lives.", author: "Richard Branson", role: "Founder", company: "Virgin" },
  { text: "Software is eating the world.", author: "Marc Andreessen", role: "Venture Capitalist", company: "Andreessen Horowitz" },
  { text: "High expectations are the key to everything.", author: "Sam Walton", role: "Founder", company: "Walmart" },
  { text: "If you don't understand the details of your business you are going to fail.", author: "Jeff Bezos", role: "Founder & CEO", company: "Amazon" },
  { text: "The secret of success is to do the common things uncommonly well.", author: "Larry Ellison", role: "Co-Founder & CTO", company: "Oracle" },
  { text: "Your brand is what other people say about you when you're not in the room.", author: "Tony Hsieh", role: "Former CEO", company: "Zappos" },
]

function getLocalThought() {
  const thought = LOCAL_THOUGHTS[THOUGHT_CACHE.cursor % LOCAL_THOUGHTS.length]
  THOUGHT_CACHE.cursor++
  return thought
}

async function refreshCache() {
  try {
    const thought = await generateThought()
    THOUGHT_CACHE.thoughts.push(thought)
    if (THOUGHT_CACHE.thoughts.length > MAX_CACHED) {
      THOUGHT_CACHE.thoughts.shift()
    }
    THOUGHT_CACHE.lastRefreshed = Date.now()
    return thought
  } catch {
    return null
  }
}

function getCachedThought() {
  if (THOUGHT_CACHE.thoughts.length > 0) {
    const thought = THOUGHT_CACHE.thoughts.shift()!
    if (THOUGHT_CACHE.thoughts.length < MAX_CACHED / 2) {
      refreshCache().catch(() => {})
    }
    return thought
  }
  return null
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`thought:${ip}`, 10, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const cached = getCachedThought()
    if (cached) {
      return NextResponse.json(cached)
    }

    if (Date.now() - THOUGHT_CACHE.lastRefreshed > CACHE_REFRESH_MS) {
      const fresh = await refreshCache()
      if (fresh) return NextResponse.json(fresh)
    }

    const localThought = getLocalThought()
    refreshCache().catch(() => {})

    return NextResponse.json(localThought)
  } catch {
    return NextResponse.json(getLocalThought())
  }
}
