import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { allTerms } from '@/data'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const totalConcepts = allTerms.length

    const learnedProgress = await prisma.progress.count({
      where: { userId: session.user.id, completed: true },
    })

    const bookmarks = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { conceptId: false, createdAt: true },
    })

    const bookmarkCount = await prisma.favorite.count({
      where: { userId: session.user.id },
    })

    const quizResults = await prisma.quizResult.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: 'desc' },
      take: 10,
    })

    const totalQuizAttempts = await prisma.quizResult.count({
      where: { userId: session.user.id },
    })

    const avgScore = quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length)
      : 0

    const lastStreak = await prisma.learningStreak.findFirst({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
    })

    const recentStreaks = await prisma.learningStreak.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 30,
    })

    let currentStreak = 0
    if (recentStreaks.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let checkDate = new Date(today)

      for (const streak of recentStreaks) {
        const streakDate = new Date(streak.date)
        streakDate.setHours(0, 0, 0, 0)
        const diffDays = Math.round((checkDate.getTime() - streakDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 0 || diffDays === 1) {
          currentStreak++
          checkDate = streakDate
        } else {
          break
        }
      }
    }

    const achievements = await prisma.achievement.findMany({
      where: { userId: session.user.id },
      orderBy: { earnedAt: 'desc' },
    })

    const recentlyViewed = await prisma.recentlyViewed.findMany({
      where: { userId: session.user.id },
      orderBy: { viewedAt: 'desc' },
      take: 6,
      select: { conceptId: true, viewedAt: true },
    })

    const interests = await prisma.userInterest.findMany({
      where: { userId: session.user.id },
      select: { category: true },
    })

    return NextResponse.json({
      stats: {
        totalConcepts,
        learnedConcepts: learnedProgress,
        progressPercentage: totalConcepts > 0 ? Math.round((learnedProgress / totalConcepts) * 100) : 0,
        currentStreak,
        bookmarkCount,
        totalQuizAttempts,
        avgScore,
      },
      quizResults,
      achievements,
      recentlyViewed: recentlyViewed.map((r) => r.conceptId),
      interests: interests.map((i) => i.category),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
