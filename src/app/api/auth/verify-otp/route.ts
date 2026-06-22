import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { otpSchema } from '@/lib/validations/auth'
import { verifyOtp } from '@/lib/otp'
import { sendWelcomeEmail } from '@/lib/email'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`verify-otp:${ip}`, 10, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const body = await request.json()
    const parsed = otpSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, otp } = parsed.data
    const type = (body.type as string) || 'VERIFY_EMAIL'

    const isValid = await verifyOtp(email, otp, type as 'VERIFY_EMAIL' | 'PASSWORD_RESET')
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new one.' },
        { status: 400 }
      )
    }

    if (type === 'VERIFY_EMAIL') {
      await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      })

      const user = await prisma.user.findUnique({ where: { email } })
      if (user?.name) {
        sendWelcomeEmail(email, user.name)
      }
    }

    return NextResponse.json(
      { message: 'Verified successfully', email },
      { status: 200 }
    )
  } catch (err) {
    console.error('[VERIFY_OTP] Unexpected error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
