import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { allTerms } from '@/data'

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    console.error('[DASHBOARD] Query failed:', err)
    return fallback
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const totalConcepts = allTerms.length

    const [learnedCount, bookmarkCount, quizResults, totalQuizAttempts, recentStreaks, achievements, recentRaw, interests] =
      await Promise.all([
        safeQuery(() => prisma.progress.count({ where: { userId: session.user.id, completed: true } }), 0),
        safeQuery(() => prisma.favorite.count({ where: { userId: session.user.id } }), 0),
        safeQuery(
          () =>
            prisma.quizResult.findMany({
              where: { userId: session.user.id },
              orderBy: { completedAt: 'desc' },
              take: 10,
            }),
          []
        ),
        safeQuery(() => prisma.quizResult.count({ where: { userId: session.user.id } }), 0),
        safeQuery(
          () =>
            prisma.learningStreak.findMany({
              where: { userId: session.user.id },
              orderBy: { date: 'desc' },
              take: 30,
            }),
          []
        ),
        safeQuery(
          () =>
            prisma.achievement.findMany({
              where: { userId: session.user.id },
              orderBy: { earnedAt: 'desc' },
            }),
          []
        ),
        safeQuery(
          () =>
            prisma.recentlyViewed.findMany({
              where: { userId: session.user.id },
              orderBy: { viewedAt: 'desc' },
              take: 6,
              select: { conceptId: true },
            }),
          []
        ),
        safeQuery(
          () =>
            prisma.userInterest.findMany({
              where: { userId: session.user.id },
              select: { category: true },
            }),
          []
        ),
      ])

    let currentStreak = 0
    if (Array.isArray(recentStreaks) && recentStreaks.length > 0) {
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

    const avgScore =
      Array.isArray(quizResults) && quizResults.length > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length
          )
        : 0

    const recentlyViewedSlugs: string[] = []
    if (Array.isArray(recentRaw)) {
      for (const r of recentRaw) {
        const concept = allTerms.find((t) => t.id === r.conceptId)
        if (concept?.slug) recentlyViewedSlugs.push(concept.slug)
      }
    }

    return NextResponse.json({
      stats: {
        totalConcepts,
        learnedConcepts: learnedCount,
        progressPercentage: totalConcepts > 0 ? Math.round((learnedCount / totalConcepts) * 100) : 0,
        currentStreak,
        bookmarkCount,
        totalQuizAttempts,
        avgScore,
      },
      quizResults,
      achievements,
      recentlyViewed: recentlyViewedSlugs,
      interests: Array.isArray(interests) ? interests.map((i) => i.category) : [],
    })
  } catch (err) {
    console.error('[DASHBOARD] Unexpected error:', err)
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
