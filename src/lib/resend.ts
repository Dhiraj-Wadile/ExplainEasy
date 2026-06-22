import nodemailer from 'nodemailer'

const isDev = process.env.NODE_ENV === 'development'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
    return transporter
  }
  return null
}

function buildEmailHtml(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0B1020;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1020;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;border:1px solid rgba(124,108,242,0.15)">
${content}
<tr><td style="padding:16px 32px;border-top:1px solid rgba(124,108,242,0.08);text-align:center">
<p style="margin:0;font-size:12px;color:#475569">&copy; 2026 ExplainEasy. All rights reserved.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

function badgeHtml(label: string, color: string) {
  return `<span style="display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:500;background:${color}15;color:${color};margin-right:6px">${label}</span>`
}

export async function sendDailyConceptEmail(
  email: string,
  conceptName: string,
  conceptUrl: string,
  options?: { category?: string; difficulty?: string; summary?: string; example?: string; whyItMatters?: string }
) {
  const t = getTransporter()
  if (!t) {
    if (isDev) {
      console.log('='.repeat(60))
      console.log(`[DEV EMAIL] TO: ${email}`)
      console.log(`[DEV EMAIL] SUBJECT: Today's Concept: ${conceptName}`)
      if (options?.summary) console.log(`[DEV EMAIL] Summary: ${options.summary}`)
      if (options?.category) console.log(`[DEV EMAIL] Category: ${options.category}`)
      if (options?.difficulty) console.log(`[DEV EMAIL] Difficulty: ${options.difficulty}`)
      console.log('='.repeat(60))
      return
    }
    console.warn('[EMAIL] SMTP not configured. Skipping daily concept email.')
    return
  }

  const categoryBadge = options?.category ? badgeHtml(options.category, '#7C6CF2') : ''
  const difficultyBadge = options?.difficulty
    ? badgeHtml(
        options.difficulty,
        options.difficulty === 'Beginner' ? '#22C55E' : options.difficulty === 'Intermediate' ? '#F59E0B' : '#3B82F6'
      )
    : ''

  const summarySection = options?.summary
    ? `<tr><td style="padding:0 32px 16px">
<p style="margin:0;font-size:15px;color:#94A3B8;line-height:1.7">${options.summary}</p>
</td></tr>`
    : ''

  const exampleSection = options?.example
    ? `<tr><td style="padding:0 32px 20px">
<div style="background:rgba(124,108,242,0.05);border-radius:12px;padding:20px;border:1px solid rgba(124,108,242,0.1)">
<p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#7C6CF2">Real-World Example</p>
<p style="margin:0;font-size:14px;color:#CBD5E1;line-height:1.6">${options.example}</p>
</div>
</td></tr>`
    : ''

  const whyMattersSection = options?.whyItMatters
    ? `<tr><td style="padding:0 32px 20px">
<div style="background:rgba(34,197,94,0.04);border-radius:12px;padding:20px;border:1px solid rgba(34,197,94,0.1)">
<p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#22C55E">Why It Matters</p>
<p style="margin:0;font-size:14px;color:#CBD5E1;line-height:1.6">${options.whyItMatters}</p>
</div>
</td></tr>`
    : ''

  const html = buildEmailHtml(`
<tr><td style="padding:40px 32px 24px;text-align:center">
<div style="width:56px;height:56px;border-radius:16px;background:rgba(124,108,242,0.12);display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px">
<span style="font-size:28px">📚</span>
</div>
<p style="margin:0 0 6px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#7C6CF2">Daily Concept</p>
<h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#F8FAFC;letter-spacing:-0.02em">${conceptName}</h1>
<p style="margin:0 0 20px;font-size:14px;color:#64748B">Your daily business concept from ExplainEasy</p>
<div style="margin-bottom:24px">${categoryBadge}${difficultyBadge}</div>
</td></tr>
${summarySection}
${exampleSection}
${whyMattersSection}
<tr><td style="padding:8px 32px 32px;text-align:center">
<table cellpadding="0" cellspacing="0" style="margin:0 auto">
<tr><td align="center" style="background:#7C6CF2;border-radius:12px;padding:14px 32px">
<a href="${conceptUrl}" style="color:#fff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block">Read Full Explanation →</a>
</td></tr>
</table>
<p style="margin:16px 0 0;font-size:13px;color:#64748B">Learn one new concept every morning.</p>
</td></tr>
`)

  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@explaineasy.com'

  try {
    const info = await t.sendMail({ from: fromEmail, to: email, subject: `📚 Today's Concept: ${conceptName}`, html })
    console.log(`[EMAIL] Sent daily concept "${conceptName}" to ${email}: ${info.messageId}`)
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${email}:`, error)
    throw error
  }
}
