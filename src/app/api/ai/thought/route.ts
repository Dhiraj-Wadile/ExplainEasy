import { NextResponse } from 'next/server'
import { generateThought } from '@/lib/openai'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

const THOUGHT_CACHE: {
  thoughts: { text: string; author: string; role: string; company: string }[]
  lastRefreshed: number
} = {
  thoughts: [],
  lastRefreshed: 0,
}

const CACHE_REFRESH_MS = 300_000
const MAX_CACHED = 5
const MIN_CACHED = 3

const LOCAL_THOUGHTS = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", role: "Management Consultant", company: "Drucker Institute" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", role: "Co-Founder & CEO", company: "Apple" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates", role: "Co-Founder", company: "Microsoft" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg", role: "Co-Founder & CEO", company: "Facebook" },
  { text: "Success is not about how much money you make, it is about the difference you make in peoples lives.", author: "Richard Branson", role: "Founder", company: "Virgin" },
  { text: "Software is eating the world.", author: "Marc Andreessen", role: "Venture Capitalist", company: "Andreessen Horowitz" },
  { text: "High expectations are the key to everything.", author: "Sam Walton", role: "Founder", company: "Walmart" },
  { text: "If you do not understand the details of your business you are going to fail.", author: "Jeff Bezos", role: "Founder & CEO", company: "Amazon" },
  { text: "The secret of success is to do the common things uncommonly well.", author: "Larry Ellison", role: "Co-Founder & CTO", company: "Oracle" },
  { text: "Your brand is what other people say about you when you are not in the room.", author: "Tony Hsieh", role: "Former CEO", company: "Zappos" },
]

async function ensureCache() {
  while (THOUGHT_CACHE.thoughts.length < MAX_CACHED) {
    const now = Date.now()
    if (now - THOUGHT_CACHE.lastRefreshed > CACHE_REFRESH_MS) {
      try {
        const thought = await generateThought()
        THOUGHT_CACHE.thoughts.push(thought)
        THOUGHT_CACHE.lastRefreshed = now
      } catch {
        break
      }
    } else {
      break
    }
  }
}

function fillFromLocal() {
  while (THOUGHT_CACHE.thoughts.length < MAX_CACHED && LOCAL_THOUGHTS.length > 0) {
    const idx = Math.floor(Math.random() * LOCAL_THOUGHTS.length)
    THOUGHT_CACHE.thoughts.push(LOCAL_THOUGHTS.splice(idx, 1)[0])
  }
}

function getNextThought() {
  if (THOUGHT_CACHE.thoughts.length < MIN_CACHED) {
    fillFromLocal()
    ensureCache().catch(() => fillFromLocal())
  }
  const thought = THOUGHT_CACHE.thoughts.shift()
  if (thought) {
    ensureCache().catch(() => fillFromLocal())
    return thought
  }
  fillFromLocal()
  return THOUGHT_CACHE.thoughts.shift() || null
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`thought:${ip}`, 10, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const thought = getNextThought()
    if (thought) return NextResponse.json(thought)
    return NextResponse.json({
      text: "The best way to predict the future is to create it.",
      author: "Peter Drucker",
      role: "Management Consultant",
      company: "Drucker Institute"
    })
  } catch {
    return NextResponse.json({
      text: "The best way to predict the future is to create it.",
      author: "Peter Drucker",
      role: "Management Consultant",
      company: "Drucker Institute"
    })
  }
}
