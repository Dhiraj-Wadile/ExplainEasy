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
    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { conceptSlug: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ progress: progress.map((p) => p.conceptSlug) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
