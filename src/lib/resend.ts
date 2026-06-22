import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

export const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendDailyConceptEmail(email: string, conceptName: string, conceptUrl: string) {
  if (!resend) {
    console.warn('Resend not configured. Skipping email.')
    return
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'daily@explaineasy.com',
      to: email,
      subject: `Today's Concept: ${conceptName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">${conceptName}</h1>
          <p>Here's your daily business concept from ExplainEasy.</p>
          <a href="${conceptUrl}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">
            Read Full Explanation
          </a>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
