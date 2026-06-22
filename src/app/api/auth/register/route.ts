import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signupSchema } from '@/lib/validations/auth'
import { createOtp } from '@/lib/otp'
import { sendVerificationOtp } from '@/lib/email'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`register:${ip}`, 3, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      if (existing.emailVerified) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
      }
      const otpResult = await createOtp(email, 'VERIFY_EMAIL')
      const sent = await sendVerificationOtp(email, otpResult.otp, name)
      if (!sent) {
        return NextResponse.json(
          { error: 'Unable to send verification email. Please try again.' },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { message: 'Verification code sent to your email', email },
        { status: 200 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified: null,
        role: 'USER',
      },
    })

    const otpResult = await createOtp(email, 'VERIFY_EMAIL')
    const sent = await sendVerificationOtp(email, otpResult.otp, name)
    if (!sent) {
      return NextResponse.json(
        { error: 'Account created but unable to send verification email. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Verification code sent to your email', email },
      { status: 201 }
    )
  } catch (err) {
    console.error('[REGISTER] Unexpected error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
