import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { verifyOtp } from '@/lib/otp'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`reset-password:${ip}`, 5, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, otp, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      )
    }

    const isValid = await verifyOtp(email, otp, 'PASSWORD_RESET')
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new one.' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    })

    return NextResponse.json(
      { message: 'Password reset successfully. Please sign in with your new password.' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[RESET_PASSWORD] Unexpected error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
