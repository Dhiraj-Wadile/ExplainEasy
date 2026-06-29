import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { interests } = await request.json()
    if (!Array.isArray(interests)) {
      return NextResponse.json({ error: 'interests must be an array' }, { status: 400 })
    }

    await prisma.userInterest.deleteMany({
      where: { userId: session.user.id },
    })

    if (interests.length > 0) {
      await prisma.userInterest.createMany({
        data: interests.map((category: string) => ({
          userId: session.user.id,
          category,
        })),
      })
    }

    return NextResponse.json({ success: true, count: interests.length })
  } catch {
    return NextResponse.json({ error: 'Failed to save interests' }, { status: 500 })
  }
}
