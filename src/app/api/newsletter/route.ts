import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { sendDailyConceptEmail } from '@/lib/resend'
import { getDailyTerm } from '@/data'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`newsletter:${ip}`, 5, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const body = await request.json()
    const rawEmail = body?.email
    const email = (rawEmail || '').toLowerCase().trim()

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (email.length > 320) {
      return NextResponse.json(
        { error: 'Email too long' },
        { status: 400 }
      )
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 200 }
      )
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    })

    const dailyTerm = getDailyTerm()
    if (dailyTerm) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.com'
      const conceptUrl = `${baseUrl}/terms/${dailyTerm.slug}`
      try {
        await sendDailyConceptEmail(email, dailyTerm.name, conceptUrl, {
          category: dailyTerm.category,
          difficulty: dailyTerm.difficulty,
          summary: dailyTerm.quickSummary || dailyTerm.simpleExplanation,
          example: dailyTerm.example,
          whyItMatters: dailyTerm.whyItMatters,
        })
      } catch (emailErr) {
        console.error('[NEWSLETTER] Failed to send welcome email:', emailErr)
      }
    }

    return NextResponse.json(
      { message: 'Subscribed successfully!' },
      { status: 201 }
    )
  } catch (err: unknown) {
    const prismaErr = err as { code?: string }
    if (prismaErr?.code === 'P2002') {
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
