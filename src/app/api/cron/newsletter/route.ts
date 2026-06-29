import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { getDailyTerm, latestTerms, allTerms } from '@/data'
import { buildNewsletterEmailHtml } from '@/lib/newsletter-email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ROADMAPS = [
  { title: 'AI Engineer Roadmap', url: '/roadmaps/ai-engineer', description: 'Master machine learning, LLMs, and AI engineering', color: 'linear-gradient(135deg,#7C6CF2,#A78BFA)', icon: '🧠' },
  { title: 'Java Backend Roadmap', url: '/roadmaps/java-backend', description: 'Full-stack Java backend with Spring Boot & DevOps', color: 'linear-gradient(135deg,#F59E0B,#F97316)', icon: '☕' },
]

function getCategories(): string[] {
  const cats = new Set(allTerms.map((t) => t.category))
  return Array.from(cats)
}

export async function GET() {
  try {
    const transporter = await getTransporter()
    if (!transporter) {
      return NextResponse.json({ error: 'SMTP not configured' }, { status: 500 })
    }

    const featured = getDailyTerm()
    if (!featured) {
      return NextResponse.json({ error: 'No concepts available' }, { status: 500 })
    }

    const latest = latestTerms.slice(0, 5)
    const categories = getCategories()

    const html = buildNewsletterEmailHtml({
      featuredConcept: featured,
      latestConcepts: latest,
      roadmaps: ROADMAPS,
      totalConcepts: allTerms.length,
      totalCategories: categories.length,
    })

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      select: { email: true },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No active subscribers', sent: 0 })
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || 'explaineasy.media@gmail.com'
    const batchSize = 50
    let sent = 0
    let failed = 0

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map((sub) =>
          transporter!.sendMail({
            from: `"ExplainEasy" <${fromEmail}>`,
            to: sub.email,
            subject: `🚀 New Concepts to Explore — ${featured.name} & More`,
            html,
          })
        )
      )
      results.forEach((r) => {
        if (r.status === 'fulfilled') sent++
        else failed++
      })
      if (i + batchSize < subscribers.length) {
        await new Promise((r) => setTimeout(r, 1000))
      }
    }

    console.log(`[NEWSLETTER CRON] Sent to ${sent}/${subscribers.length} (${failed} failed)`)

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${sent} subscribers${failed ? ` (${failed} failed)` : ''}`,
      featured: featured.name,
      conceptsIncluded: latest.length,
      roadmapsIncluded: ROADMAPS.length,
      sent,
      total: subscribers.length,
    })
  } catch (err) {
    console.error('[NEWSLETTER CRON] Failed:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to send newsletter', details: message }, { status: 500 })
  }
}

async function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  try {
    await transporter.verify()
    return transporter
  } catch {
    console.warn('[NEWSLETTER CRON] SMTP verification failed, will try to send anyway')
    return transporter
  }
}
