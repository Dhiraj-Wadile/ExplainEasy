import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDailyTerm, allTerms } from '@/data'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CONTENT_THEMES = [
  'business',
  'roadmap',
  'tech',
  'finance',
  'startup',
  'casestudy',
  'wisdom',
]

const roadmapContent = [
  {
    title: 'AI Engineer Roadmap 2026',
    slug: 'ai-engineer',
    description: 'Master machine learning, LLMs, vector databases, and AI engineering with our comprehensive step-by-step roadmap.',
    category: 'AI Explained',
    difficulty: 'Intermediate',
    icon: '🧠',
    gradient: 'linear-gradient(135deg,#7C6CF2,#A78BFA)',
  },
  {
    title: 'Java Backend Roadmap',
    slug: 'java-backend',
    description: 'Full-stack Java backend development with Spring Boot, microservices, and DevOps from beginner to advanced.',
    category: 'Tech Explained',
    difficulty: 'Intermediate',
    icon: '☕',
    gradient: 'linear-gradient(135deg,#F59E0B,#F97316)',
  },
  {
    title: 'Full Stack Developer Roadmap',
    slug: 'full-stack',
    description: 'Complete guide to becoming a full stack developer covering frontend, backend, databases, and deployment.',
    category: 'Tech Explained',
    difficulty: 'Beginner',
    icon: '💻',
    gradient: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
  },
  {
    title: 'Data Science Roadmap',
    slug: 'data-science',
    description: 'Learn statistics, Python, machine learning, and data visualization to become a data scientist.',
    category: 'AI Explained',
    difficulty: 'Beginner',
    icon: '📊',
    gradient: 'linear-gradient(135deg,#10B981,#059669)',
  },
  {
    title: 'DevOps Engineer Roadmap',
    slug: 'devops',
    description: 'Master CI/CD, Docker, Kubernetes, cloud platforms, and infrastructure as code.',
    category: 'Tech Explained',
    difficulty: 'Intermediate',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg,#EC4899,#F43F5E)',
  },
  {
    title: 'Product Manager Roadmap',
    slug: 'product-manager',
    description: 'Learn product strategy, user research, analytics, and agile methodologies to become a PM.',
    category: 'Product Management',
    difficulty: 'Beginner',
    icon: '📋',
    gradient: 'linear-gradient(135deg,#8B5CF6,#6D28D9)',
  },
  {
    title: 'Digital Marketing Roadmap',
    slug: 'digital-marketing',
    description: 'Master SEO, content marketing, social media, paid ads, and marketing analytics.',
    category: 'Marketing',
    difficulty: 'Beginner',
    icon: '📣',
    gradient: 'linear-gradient(135deg,#F97316,#EA580C)',
  },
]

const quotes = [
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'It is not the strongest of the species that survives, but the most adaptable.', author: 'Charles Darwin' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'The best investment you can make is in yourself.', author: 'Warren Buffett' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
]

const caseStudies = [
  {
    title: 'How Airbnb Disrupted the Hospitality Industry',
    company: 'Airbnb',
    slug: 'airbnb',
    description: 'From air mattresses to a $100B valuation — how Airbnb used marketplace dynamics and trust-building to revolutionize travel accommodation worldwide.',
  },
  {
    title: 'The Netflix Pivot: From DVDs to Streaming Empire',
    company: 'Netflix',
    slug: 'netflix',
    description: 'How Netflix transformed from a DVD rental service into the world\'s leading streaming platform, disrupting traditional media and changing how we consume entertainment.',
  },
  {
    title: 'Stripe: The Payment Infrastructure of the Internet',
    company: 'Stripe',
    slug: 'stripe',
    description: 'The story of how two Irish brothers built the most valuable private fintech company by solving online payments for developers.',
  },
  {
    title: 'Tesla\'s Disruption of the Automotive Industry',
    company: 'Tesla',
    slug: 'tesla',
    description: 'How Tesla redefined the car industry with electric vehicles, direct-to-consumer sales, and software-defined cars.',
  },
]

const techConcepts = allTerms.filter(t => t.category === 'Tech Explained' || t.category === 'AI Explained' || t.category === 'Technology').slice(0, 10)
const financeConcepts = allTerms.filter(t => t.category === 'Finance').slice(0, 10)
const startupConcepts = allTerms.filter(t => t.category === 'Startup' || t.category === 'Entrepreneurship').slice(0, 10)

function getContentType(): string {
  const day = new Date().getDay()
  return CONTENT_THEMES[day === 0 ? 6 : day - 1]
}

function getRandomItem<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.vercel.app'
}

function buildEmailWrapper(content: string): string {
  const baseUrl = getBaseUrl()
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  @media only screen and (max-width:560px){
    .container{width:100%!important;max-width:100%!important}
    .content{padding:24px 16px!important}
    .header{padding:28px 16px 20px!important}
    .footer{padding:16px!important}
    .btn{padding:12px 24px!important;font-size:14px!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#05080F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05080F;padding:20px 10px;background-image:radial-gradient(circle at 50% 0,rgba(124,108,242,0.08) 0,transparent 70%)"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" class="container" style="background:#0F1322;border-radius:20px;border:1px solid rgba(124,108,242,0.12);overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
<tr><td style="background:linear-gradient(135deg,#1a1040 0%,#0F1322 100%);padding:20px 32px;text-align:center;border-bottom:1px solid rgba(124,108,242,0.06)">
  <a href="${baseUrl}" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px">
    <div style="width:28px;height:28px;border-radius:6px;background:#7C6CF2;display:flex;align-items:center;justify-content:center">
      <span style="font-size:16px;color:#fff;font-weight:700">E</span>
    </div>
    <span style="font-size:15px;font-weight:700;color:#F8FAFC">explain<span style="color:#7C6CF2">easy</span></span>
  </a>
</td></tr>
${content}
<tr><td style="padding:24px 32px;border-top:1px solid rgba(124,108,242,0.06);text-align:center;background:rgba(0,0,0,0.15)" class="footer">
<p style="margin:0 0 12px;font-size:12px;color:#475569;line-height:1.6">You are receiving this because you subscribed to ExplainEasy daily learning.<br>Learn one concept every day and master business, finance, tech, and more.</p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto 12px"><tr>
<td style="padding:0 8px"><a href="${baseUrl}" style="color:#7C6CF2;font-size:12px;text-decoration:none">Home</a></td>
<td style="padding:0 8px"><a href="${baseUrl}/categories" style="color:#7C6CF2;font-size:12px;text-decoration:none">Concepts</a></td>
<td style="padding:0 8px"><a href="${baseUrl}/roadmaps" style="color:#7C6CF2;font-size:12px;text-decoration:none">Roadmaps</a></td>
<td style="padding:0 8px"><a href="https://explaineasy.vercel.app/unsubscribe" style="color:#7C6CF2;font-size:12px;text-decoration:none">Unsubscribe</a></td>
</tr></table>
<p style="margin:0;font-size:11px;color:#333">&copy; ${new Date().getFullYear()} ExplainEasy. Learn smarter, not harder.</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`
}

function buildConceptHtml(concept: typeof allTerms[0], baseUrl: string): string {
  const url = `${baseUrl}/terms/${concept.slug}`
  const difficultyColor = concept.difficulty === 'Beginner' ? '#22C55E' : concept.difficulty === 'Intermediate' ? '#F59E0B' : '#3B82F6'

  let extraSections = ''
  if (concept.whyItMatters) {
    extraSections += `
    <tr><td style="padding:0 32px 16px">
      <div style="background:rgba(34,197,94,0.04);border-radius:12px;padding:18px 22px;border-left:3px solid #22C55E">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#22C55E">Why It Matters</p>
        <p style="margin:0;font-size:14px;color:#94A3B8;line-height:1.7">${concept.whyItMatters}</p>
      </div>
    </td></tr>`
  }
  if (concept.example) {
    extraSections += `
    <tr><td style="padding:0 32px 16px">
      <div style="background:rgba(251,191,36,0.04);border-radius:12px;padding:18px 22px;border-left:3px solid #F59E0B">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#F59E0B">Real-World Example</p>
        <p style="margin:0;font-size:14px;color:#94A3B8;line-height:1.7">${concept.example}</p>
      </div>
    </td></tr>`
  }
  if (concept.visualDiagram) {
    extraSections += `
    <tr><td style="padding:0 32px 16px">
      <div style="background:rgba(124,108,242,0.04);border-radius:12px;padding:18px 22px;border:1px solid rgba(124,108,242,0.1)">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#7C6CF2">Flow / Process</p>
        <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.7;font-family:monospace">${concept.visualDiagram}</p>
      </div>
    </td></tr>`
  }
  if (concept.formula) {
    extraSections += `
    <tr><td style="padding:0 32px 16px">
      <div style="background:rgba(124,108,242,0.03);border-radius:12px;padding:18px 22px;text-align:center;border:1px solid rgba(124,108,242,0.08)">
        <p style="margin:0 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#7C6CF2">The Formula</p>
        <p style="margin:0 0 6px;font-size:16px;color:#F8FAFC;font-family:Georgia,serif;font-style:italic">${concept.formula}</p>
        ${concept.formulaDescription ? `<p style="margin:0;font-size:12px;color:#64748B">${concept.formulaDescription}</p>` : ''}
      </div>
    </td></tr>`
  }

  return buildEmailWrapper(`
<tr><td style="background:linear-gradient(135deg,rgba(124,108,242,0.12),rgba(124,108,242,0.04));padding:36px 32px 28px;text-align:center">
  <div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,#7C6CF2,#A78BFA);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 8px 24px rgba(124,108,242,0.25)">
    <span style="font-size:30px">📚</span>
  </div>
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7C6CF2">Daily Concept</p>
  <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#F8FAFC;letter-spacing:-0.03em">${concept.name}</h1>
  <p style="margin:0 0 16px;font-size:14px;color:#64748B">Your daily learning from ExplainEasy</p>
  <div>
    <span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(124,108,242,0.12);color:#7C6CF2;margin:0 4px 4px 0">${concept.category}</span>
    <span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:${difficultyColor}15;color:${difficultyColor};margin:0 4px 4px 0">${concept.difficulty}</span>
  </div>
</td></tr>
<tr><td style="padding:24px 32px 0">
  <div style="background:rgba(124,108,242,0.05);border-radius:14px;padding:20px 24px;border:1px solid rgba(124,108,242,0.1)">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#7C6CF2">TL;DR</p>
    <p style="margin:0;font-size:15px;color:#CBD5E1;line-height:1.7;font-weight:500">${concept.quickSummary || concept.simpleExplanation}</p>
  </div>
</td></tr>
<tr><td style="padding:20px 32px 0">
  <h2 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#F8FAFC">What is it?</h2>
  <p style="margin:0;font-size:14px;color:#94A3B8;line-height:1.7">${concept.definition}</p>
</td></tr>
${extraSections}
<tr><td style="padding:8px 32px 32px;text-align:center">
  <table cellpadding="0" cellspacing="0" style="margin:0 auto"><tr><td align="center" style="background:linear-gradient(135deg,#7C6CF2,#A78BFA);border-radius:12px;padding:14px 36px;box-shadow:0 4px 16px rgba(124,108,242,0.3)">
    <a href="${url}" style="color:#fff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block">Read Full Explanation →</a>
  </td></tr></table>
  ${concept.tags && concept.tags.length > 0 ? `
  <p style="margin:12px 0 0;font-size:11px;color:#475569">Tags: ${concept.tags.slice(0, 5).join(' · ')}</p>` : ''}
</td></tr>
`)
}

function buildRoadmapHtml(roadmap: typeof roadmapContent[0], baseUrl: string): string {
  const url = `${baseUrl}/roadmaps/${roadmap.slug}`
  return buildEmailWrapper(`
<tr><td style="background:linear-gradient(135deg,#0F1322 0%,#1A1040 50%,#0F1322 100%);padding:40px 32px 32px;text-align:center">
  <div style="width:72px;height:72px;border-radius:20px;background:${roadmap.gradient};display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 8px 32px rgba(124,108,242,0.3)">
    <span style="font-size:34px">${roadmap.icon}</span>
  </div>
  <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7C6CF2">Learning Roadmap</p>
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#F8FAFC;letter-spacing:-0.03em">${roadmap.title}</h1>
  <p style="margin:0;font-size:14px;color:#64748B;line-height:1.6">Your step-by-step guide to mastering this skill.</p>
</td></tr>
<tr><td style="padding:28px 32px 24px">
  <div style="background:rgba(124,108,242,0.05);border-radius:16px;padding:24px;border:1px solid rgba(124,108,242,0.1)">
    <p style="margin:0 0 12px;font-size:15px;color:#CBD5E1;line-height:1.7">${roadmap.description}</p>
    <div style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(124,108,242,0.12);color:#7C6CF2;margin-right:6px">${roadmap.category}</div>
    <div style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(34,197,94,0.12);color:#22C55E">${roadmap.difficulty}</div>
  </div>
</td></tr>
<tr><td style="padding:0 32px 32px;text-align:center">
  <table cellpadding="0" cellspacing="0" style="margin:0 auto"><tr><td align="center" style="background:${roadmap.gradient};border-radius:12px;padding:14px 36px;box-shadow:0 4px 16px rgba(124,108,242,0.3)">
    <a href="${url}" style="color:#fff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block">Explore Roadmap →</a>
  </td></tr></table>
  <p style="margin:14px 0 0;font-size:12px;color:#475569">Follow along, track your progress, and level up.</p>
</td></tr>
`)
}

function buildWisdomHtml(quote: { text: string; author: string }, baseUrl: string): string {
  return buildEmailWrapper(`
<tr><td style="background:linear-gradient(135deg,#0F1322 0%,#1A1040 50%,#0F1322 100%);padding:60px 32px 40px;text-align:center">
  <div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#F59E0B,#F97316);display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 8px 32px rgba(245,158,11,0.3)">
    <span style="font-size:34px">💡</span>
  </div>
  <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#F59E0B">Sunday Wisdom</p>
  <div style="max-width:400px;margin:0 auto">
    <p style="margin:0 0 20px;font-size:22px;font-weight:600;color:#F8FAFC;line-height:1.5;font-style:italic">&ldquo;${quote.text}&rdquo;</p>
    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#F59E0B,transparent);margin:0 auto 16px"></div>
    <p style="margin:0;font-size:15px;color:#94A3B8;font-weight:500">— ${quote.author}</p>
  </div>
</td></tr>
<tr><td style="padding:24px 32px 32px;text-align:center">
  <p style="margin:0 0 18px;font-size:13px;color:#64748B;line-height:1.6">Start your week with wisdom.<br>Explore business concepts that bring this idea to life.</p>
  <table cellpadding="0" cellspacing="0" style="margin:0 auto"><tr><td align="center" style="background:rgba(124,108,242,0.08);border-radius:12px;padding:12px 28px;border:1px solid rgba(124,108,242,0.1)">
    <a href="${baseUrl}/categories" style="color:#A78BFA;font-size:14px;font-weight:600;text-decoration:none">Explore Concepts →</a>
  </td></tr></table>
</td></tr>
`)
}

function buildCaseStudyHtml(cs: typeof caseStudies[0], baseUrl: string): string {
  const url = `${baseUrl}/case-studies/${cs.slug}`
  return buildEmailWrapper(`
<tr><td style="background:linear-gradient(135deg,#0F1322 0%,#1A1040 50%,#0F1322 100%);padding:40px 32px 32px;text-align:center">
  <div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#EC4899,#F43F5E);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 8px 32px rgba(244,63,94,0.3)">
    <span style="font-size:34px">📖</span>
  </div>
  <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#EC4899">Case Study</p>
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#F8FAFC;letter-spacing:-0.03em">${cs.title}</h1>
  <p style="margin:0;font-size:14px;color:#64748B">Deep dive into ${cs.company}'s success story</p>
</td></tr>
<tr><td style="padding:28px 32px 24px">
  <div style="background:rgba(124,108,242,0.05);border-radius:16px;padding:24px;border:1px solid rgba(124,108,242,0.1)">
    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#7C6CF2">Company</p>
    <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#F8FAFC">${cs.company}</p>
    <p style="margin:0;font-size:14px;color:#94A3B8;line-height:1.7">${cs.description}</p>
  </div>
</td></tr>
<tr><td style="padding:0 32px 32px;text-align:center">
  <table cellpadding="0" cellspacing="0" style="margin:0 auto"><tr><td align="center" style="background:linear-gradient(135deg,#EC4899,#F43F5E);border-radius:12px;padding:14px 36px;">
    <a href="${url}" style="color:#fff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block">Read Full Case Study →</a>
  </td></tr></table>
</td></tr>
`)
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
    return transporter
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const baseUrl = getBaseUrl()
    const contentType = getContentType()
    const transporter = await getTransporter()

    if (!transporter) {
      return NextResponse.json({ error: 'SMTP not configured' }, { status: 500 })
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      select: { email: true },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No active subscribers', sent: 0 })
    }

    let subject: string
    let html: string
    let contentTypeLabel: string

    // Generate content based on day of week
    switch (contentType) {
      case 'roadmap': {
        const roadmap = getRandomItem(roadmapContent)
        if (!roadmap) return NextResponse.json({ error: 'No roadmap content available' }, { status: 500 })
        subject = `🗺️ Today's Learning Roadmap: ${roadmap.title}`
        html = buildRoadmapHtml(roadmap, baseUrl)
        contentTypeLabel = 'roadmap'
        break
      }
      case 'wisdom': {
        const quote = getRandomItem(quotes)
        if (!quote) return NextResponse.json({ error: 'No quotes available' }, { status: 500 })
        subject = `💡 Sunday Wisdom: "${quote.text.substring(0, 50)}..."`
        html = buildWisdomHtml(quote, baseUrl)
        contentTypeLabel = 'wisdom'
        break
      }
      case 'casestudy': {
        const cs = getRandomItem(caseStudies)
        if (!cs) return NextResponse.json({ error: 'No case studies available' }, { status: 500 })
        subject = `📖 Case Study: ${cs.title}`
        html = buildCaseStudyHtml(cs, baseUrl)
        contentTypeLabel = 'casestudy'
        break
      }
      case 'tech': {
        const concept = getRandomItem(techConcepts) || getDailyTerm()
        if (!concept) return NextResponse.json({ error: 'No tech concepts available' }, { status: 500 })
        subject = `⚡ Tech Concept: ${concept.name}`
        html = buildConceptHtml(concept, baseUrl)
        contentTypeLabel = 'tech'
        break
      }
      case 'finance': {
        const concept = getRandomItem(financeConcepts) || getDailyTerm()
        if (!concept) return NextResponse.json({ error: 'No finance concepts available' }, { status: 500 })
        subject = `💰 Finance Concept: ${concept.name}`
        html = buildConceptHtml(concept, baseUrl)
        contentTypeLabel = 'finance'
        break
      }
      case 'startup': {
        const concept = getRandomItem(startupConcepts) || getDailyTerm()
        if (!concept) return NextResponse.json({ error: 'No startup concepts available' }, { status: 500 })
        subject = `🚀 Startup Concept: ${concept.name}`
        html = buildConceptHtml(concept, baseUrl)
        contentTypeLabel = 'startup'
        break
      }
      default: {
        const dailyTerm = getDailyTerm()
        if (!dailyTerm) {
          return NextResponse.json({ error: 'No concepts available' }, { status: 500 })
        }
        subject = `📚 Daily Concept: ${dailyTerm.name}`
        html = buildConceptHtml(dailyTerm, baseUrl)
        contentTypeLabel = 'business'
      }
    }

    // Send emails in batches
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'explaineasy.media@gmail.com'
    const batchSize = 50
    let sent = 0
    let failed = 0

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map((sub) =>
          transporter!.sendMail({
            from: `"ExplainEasy Daily" <${fromEmail}>`,
            to: sub.email,
            subject,
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

    console.log(`[DAILY CONCEPT CRON] Sent "${subject}" to ${sent}/${subscribers.length} (${failed} failed)`)

    return NextResponse.json({
      success: true,
      message: `Daily content sent to ${sent} subscribers${failed ? ` (${failed} failed)` : ''}`,
      contentType: contentTypeLabel,
      subscribers: sent,
      total: subscribers.length,
    })
  } catch (err) {
    console.error('[DAILY CONCEPT CRON] Failed:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to send daily content', details: message }, { status: 500 })
  }
}
