import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getDailyTerm } from '@/data'
import { allTerms } from '@/data'

function buildDailyEmailHtml(concept: {
  name: string
  category: string
  difficulty: string
  definition: string
  simpleExplanation: string
  example?: string
  whyItMatters?: string
  quickSummary?: string
  commonMistakes?: string[]
  slug: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.com'
  const conceptUrl = `${baseUrl}/terms/${concept.slug}`
  const difficultyColor = concept.difficulty === 'Beginner' ? '#22C55E' : concept.difficulty === 'Intermediate' ? '#F59E0B' : '#3B82F6'

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0B1020;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1020;padding:40px 16px">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:20px;border:1px solid rgba(124,108,242,0.12);overflow:hidden">

<!-- Header gradient -->
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

<!-- Quick Summary -->
<tr><td style="padding:28px 32px 0">
<div style="background:rgba(124,108,242,0.05);border-radius:14px;padding:20px 24px;border:1px solid rgba(124,108,242,0.1)">
<p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#7C6CF2">TL;DR</p>
<p style="margin:0;font-size:15px;color:#CBD5E1;line-height:1.7;font-weight:500">${concept.quickSummary || concept.simpleExplanation}</p>
</div>
</td></tr>

<!-- Definition -->
<tr><td style="padding:24px 32px 0">
<h2 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#F8FAFC">What is it?</h2>
<p style="margin:0;font-size:14px;color:#94A3B8;line-height:1.7">${concept.definition}</p>
</td></tr>

<!-- Simple Explanation -->
<tr><td style="padding:20px 32px 0">
<h2 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#F8FAFC">In Simple Terms</h2>
<p style="margin:0;font-size:14px;color:#94A3B8;line-height:1.7">${concept.simpleExplanation}</p>
</td></tr>

${concept.example ? `
<!-- Real-World Example -->
<tr><td style="padding:20px 32px 0">
<h2 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#F8FAFC">Real-World Example</h2>
<div style="background:rgba(34,197,94,0.04);border-radius:12px;padding:18px 20px;border:1px solid rgba(34,197,94,0.1)">
<p style="margin:0;font-size:14px;color:#CBD5E1;line-height:1.7">${concept.example}</p>
</div>
</td></tr>` : ''}

${concept.whyItMatters ? `
<!-- Why It Matters -->
<tr><td style="padding:20px 32px 0">
<h2 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#F8FAFC">Why It Matters</h2>
<div style="background:rgba(251,191,36,0.04);border-radius:12px;padding:18px 20px;border:1px solid rgba(251,191,36,0.1)">
<p style="margin:0;font-size:14px;color:#CBD5E1;line-height:1.7">${concept.whyItMatters}</p>
</div>
</td></tr>` : ''}

${concept.commonMistakes && concept.commonMistakes.length > 0 ? `
<!-- Common Mistakes -->
<tr><td style="padding:20px 32px 0">
<h2 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#F8FAFC">Common Mistakes to Avoid</h2>
<table cellpadding="0" cellspacing="0">${concept.commonMistakes.slice(0, 3).map(m => `
<tr><td style="padding:0 0 8px">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:20px;vertical-align:top;padding-top:2px"><span style="display:inline-block;width:18px;height:18px;border-radius:9px;background:rgba(239,68,68,0.12);text-align:center;line-height:18px;font-size:11px;color:#EF4444;font-weight:700">!</span></td>
<td style="padding-left:10px"><p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.5">${m}</p></td>
</tr></table>
</td></tr>`).join('')}</table>
</td></tr>` : ''}

<!-- CTA Button -->
<tr><td style="padding:28px 32px 32px;text-align:center">
<table cellpadding="0" cellspacing="0" style="margin:0 auto">
<tr><td align="center" style="background:linear-gradient(135deg,#7C6CF2,#A78BFA);border-radius:12px;padding:14px 36px;box-shadow:0 4px 16px rgba(124,108,242,0.3)">
<a href="${conceptUrl}" style="color:#fff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block">Read Full Explanation →</a>
</td></tr>
</table>
<p style="margin:14px 0 0;font-size:12px;color:#475569">Take the quiz, test your knowledge, and track your progress.</p>
</td></tr>

<!-- Related concepts teaser -->
<tr><td style="padding:0 32px 28px;text-align:center">
<p style="margin:0 0 10px;font-size:13px;color:#64748B;font-weight:500">Keep learning</p>
<p style="margin:0;font-size:12px;color:#475569">
ExplainEasy has <strong style="color:#94A3B8">${allTerms.length}+ concepts</strong> across 15 categories.
<br>Learn something new every day.</p>
</td></tr>

<!-- Footer -->
<tr><td style="padding:16px 32px;border-top:1px solid rgba(124,108,242,0.08);text-align:center">
<p style="margin:0 0 4px;font-size:11px;color:#475569">You're receiving this because you subscribed to ExplainEasy Daily.</p>
<p style="margin:0;font-size:11px;color:#475569">
<a href="${baseUrl}" style="color:#7C6CF2;text-decoration:none">ExplainEasy</a> &bull; 
<a href="${baseUrl}/unsubscribe" style="color:#7C6CF2;text-decoration:none">Unsubscribe</a>
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const dailyTerm = getDailyTerm()
    if (!dailyTerm) {
      return NextResponse.json({ error: 'No concepts available' }, { status: 500 })
    }

    const host = process.env.SMTP_HOST
    const port = parseInt(process.env.SMTP_PORT || '587')
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) {
      return NextResponse.json({
        error: 'SMTP not configured',
        details: 'Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local',
      }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const html = buildDailyEmailHtml({
      name: dailyTerm.name,
      category: dailyTerm.category,
      difficulty: dailyTerm.difficulty,
      definition: dailyTerm.definition,
      simpleExplanation: dailyTerm.simpleExplanation,
      example: dailyTerm.example,
      whyItMatters: dailyTerm.whyItMatters,
      quickSummary: dailyTerm.quickSummary,
      commonMistakes: dailyTerm.commonMistakes,
      slug: dailyTerm.slug,
    })

    const fromEmail = process.env.SMTP_FROM_EMAIL || user

    const info = await transporter.sendMail({
      from: `"ExplainEasy" <${fromEmail}>`,
      to: email,
      subject: `📚 Daily Concept: ${dailyTerm.name}`,
      html,
    })

    console.log(`[EMAIL] Sent daily concept to ${email}: ${info.messageId}`)

    return NextResponse.json({
      success: true,
      message: `Daily concept "${dailyTerm.name}" sent to ${email}`,
      messageId: info.messageId,
      concept: dailyTerm.name,
    })
  } catch (error: unknown) {
    const err = error as Error & { code?: string }
    console.error('[EMAIL] Failed to send:', err.message)

    if (err.code === 'EAUTH') {
      return NextResponse.json({
        error: 'Email authentication failed',
        details: 'Gmail requires an App Password. Go to https://myaccount.google.com/apppasswords, generate one, and update SMTP_PASS in .env.local',
        fix: '1. Go to https://myaccount.google.com/apppasswords\n2. Generate an App Password\n3. Replace SMTP_PASS in .env.local with the 16-char App Password',
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'Failed to send email',
      details: err.message,
    }, { status: 500 })
  }
}
