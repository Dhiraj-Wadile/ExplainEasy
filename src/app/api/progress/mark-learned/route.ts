import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`progress:${ip}`, 30, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const { conceptSlug } = await request.json()
    if (!conceptSlug || typeof conceptSlug !== 'string') {
      return NextResponse.json({ error: 'conceptSlug is required' }, { status: 400 })
    }

    await prisma.progress.upsert({
      where: {
        userId_conceptSlug: { userId: session.user.id, conceptSlug },
      },
      update: { completed: true },
      create: { userId: session.user.id, conceptSlug, completed: true },
    })

    const totalProgress = await prisma.progress.count({ where: { userId: session.user.id, completed: true } })

    return NextResponse.json({ success: true, totalLearned: totalProgress })
  } catch {
    return NextResponse.json({ error: 'Failed to mark as learned' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { conceptSlug } = await request.json()
    if (!conceptSlug) {
      return NextResponse.json({ error: 'conceptSlug is required' }, { status: 400 })
    }

    await prisma.progress.deleteMany({
      where: { userId: session.user.id, conceptSlug },
    })

    const totalProgress = await prisma.progress.count({ where: { userId: session.user.id, completed: true } })

    return NextResponse.json({ success: true, totalLearned: totalProgress })
  } catch {
    return NextResponse.json({ error: 'Failed to remove progress' }, { status: 500 })
  }
}
