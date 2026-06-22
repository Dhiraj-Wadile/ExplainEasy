import { prisma } from './prisma'
import crypto from 'crypto'

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString()
}

export async function createOtp(
  email: string,
  type: 'VERIFY_EMAIL' | 'PASSWORD_RESET' = 'VERIFY_EMAIL'
): Promise<{ otp: string; expiresAt: Date }> {
  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.otp.create({
    data: {
      email: email.toLowerCase().trim(),
      otp,
      type,
      expiresAt,
    },
  })

  return { otp, expiresAt }
}

export async function verifyOtp(
  email: string,
  otp: string,
  type: 'VERIFY_EMAIL' | 'PASSWORD_RESET' = 'VERIFY_EMAIL'
): Promise<boolean> {
  const record = await prisma.otp.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      otp,
      type,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) return false

  await prisma.otp.update({
    where: { id: record.id },
    data: { used: true },
  })

  return true
}

export async function invalidateOtps(email: string, type: 'VERIFY_EMAIL' | 'PASSWORD_RESET'): Promise<void> {
  await prisma.otp.updateMany({
    where: {
      email: email.toLowerCase().trim(),
      type,
      used: false,
    },
    data: { used: true },
  })
}

export async function getRecentOtpCount(email: string, minutes = 10): Promise<number> {
  const since = new Date(Date.now() - minutes * 60 * 1000)
  return prisma.otp.count({
    where: {
      email: email.toLowerCase().trim(),
      createdAt: { gte: since },
    },
  })
}
