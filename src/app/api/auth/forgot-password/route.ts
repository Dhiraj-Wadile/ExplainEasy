import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { createOtp, getRecentOtpCount } from '@/lib/otp'
import { sendPasswordResetOtp } from '@/lib/email'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`forgot-password:${ip}`, 3, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      )
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'This account uses Google/GitHub sign-in. Password reset is not available.' },
        { status: 400 }
      )
    }

    const recentCount = await getRecentOtpCount(email, 10)
    if (recentCount >= 5) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again later.' },
        { status: 429 }
      )
    }

    const otpResult = await createOtp(email, 'PASSWORD_RESET')
    const sent = await sendPasswordResetOtp(email, otpResult.otp, user.name || undefined)

    if (!sent) {
      return NextResponse.json(
        { error: 'Unable to send password reset email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Password reset code sent to your email', email },
      { status: 200 }
    )
  } catch (err) {
    console.error('[FORGOT_PASSWORD] Unexpected error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
