import { Resend } from 'resend'

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@explaineasy.com'
const isDev = process.env.NODE_ENV === 'development'

let resendClient: Resend | null = null

function getResend(): Resend | null {
  if (resendClient) return resendClient
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  try {
    resendClient = new Resend(apiKey)
    return resendClient
  } catch {
    return null
  }
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  otp?: string
): Promise<boolean> {
  const resend = getResend()

  if (resend) {
    try {
      await resend.emails.send({
        from: RESEND_FROM,
        to,
        subject,
        html,
      })
      console.log(`[EMAIL] Sent "${subject}" to ${to}`)
      return true
    } catch (err) {
      console.error(`[EMAIL] Resend API error for "${subject}" to ${to}:`, err)
    }
  }

  if (isDev && otp) {
    console.log('='.repeat(60))
    console.log(`[DEV EMAIL] TO: ${to}`)
    console.log(`[DEV EMAIL] SUBJECT: ${subject}`)
    console.log(`[DEV EMAIL] OTP: ${otp}`)
    console.log(`[DEV EMAIL] Expires: ${new Date(Date.now() + 10 * 60 * 1000).toISOString()}`)
    console.log('='.repeat(60))
    return true
  }

  console.error(`[EMAIL] Failed to send "${subject}" to ${to} — Resend not configured`)
  return false
}

function baseHtml(content: string): string {
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

function otpHtml(otp: string, title: string, subtitle: string): string {
  return baseHtml(`
<tr><td style="padding:40px 32px 24px;text-align:center">
<div style="width:56px;height:56px;border-radius:16px;background:rgba(124,108,242,0.12);display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px">
<span style="font-size:28px">${title.includes('Verify') ? '🔐' : '🔑'}</span>
</div>
<h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#F8FAFC">${title}</h1>
<p style="margin:0 0 24px;font-size:15px;color:#94A3B8;line-height:1.6">${subtitle}</p>
<div style="background:rgba(124,108,242,0.08);border-radius:12px;padding:20px;margin-bottom:24px;letter-spacing:12px;font-size:36px;font-weight:700;color:#7C6CF2;font-family:monospace">${otp}</div>
<p style="margin:0 0 8px;font-size:13px;color:#64748B">This code expires in <strong style="color:#F8FAFC">10 minutes</strong></p>
<p style="margin:0;font-size:13px;color:#64748B">If you didn't request this, you can ignore this email.</p>
</td></tr>`)
}

export async function sendVerificationOtp(email: string, otp: string, name?: string): Promise<boolean> {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  return sendEmail(
    email,
    'Verify your ExplainEasy account',
    otpHtml(otp, 'Verify your email', `${greeting}<br>Use this code to verify your ExplainEasy account:`),
    otp
  )
}

export async function sendPasswordResetOtp(email: string, otp: string, name?: string): Promise<boolean> {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  return sendEmail(
    email,
    'Reset your ExplainEasy password',
    otpHtml(otp, 'Reset your password', `${greeting}<br>Use this code to reset your ExplainEasy password:`),
    otp
  )
}

export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  return sendEmail(
    email,
    'Welcome to ExplainEasy!',
    baseHtml(`
<tr><td style="padding:40px 32px 24px;text-align:center">
<div style="width:56px;height:56px;border-radius:16px;background:rgba(124,108,242,0.12);display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px">
<span style="font-size:28px">🎉</span>
</div>
<h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#F8FAFC">Welcome to ExplainEasy!</h1>
<p style="margin:0 0 8px;font-size:15px;color:#94A3B8;line-height:1.6">${greeting}</p>
<p style="margin:0 0 24px;font-size:15px;color:#94A3B8;line-height:1.6">You're all set. Start exploring 500+ business concepts explained simply.</p>
<table cellpadding="0" cellspacing="0" style="margin-bottom:24px">
<tr><td align="center" style="background:#7C6CF2;border-radius:12px;padding:12px 32px">
<a href="https://explaineasy.com/categories" style="color:#fff;font-size:15px;font-weight:600;text-decoration:none">Explore Concepts</a>
</td></tr>
</table>
<p style="margin:0;font-size:13px;color:#64748B">Learn anything. Understand everything.</p>
</td></tr>`)
  )
}
