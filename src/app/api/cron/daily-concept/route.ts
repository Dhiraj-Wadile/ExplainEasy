import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDailyTerm } from '@/data'
import { sendDailyConceptEmail } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dailyTerm = getDailyTerm()
    if (!dailyTerm) {
      return NextResponse.json({ error: 'No concepts available' }, { status: 500 })
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.com'
    const conceptUrl = `${baseUrl}/terms/${dailyTerm.slug}`

    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        sendDailyConceptEmail(sub.email, dailyTerm.name, conceptUrl)
      )
    )

    const sent = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({
      message: `Daily concept sent to ${sent} subscribers${failed ? ` (${failed} failed)` : ''}`,
      concept: dailyTerm.name,
      subscribers: sent,
    })
  } catch (err) {
    console.error('Daily concept cron failed:', err)
    return NextResponse.json({ error: 'Failed to send daily concept' }, { status: 500 })
  }
}
