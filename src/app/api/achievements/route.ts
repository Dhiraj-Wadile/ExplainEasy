import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: session.user.id },
      orderBy: { earnedAt: 'desc' },
    })

    return NextResponse.json({ achievements })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}
