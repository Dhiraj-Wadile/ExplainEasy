import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    console.error('[QUIZ] DB operation failed:', err)
    return fallback
  }
}

function getTodayUTC(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`quiz:submit:${ip}`, 20, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  try {
    const { conceptSlug, answers, questions } = await request.json()

    if (!conceptSlug || !Array.isArray(answers) || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    let score = 0
    const results = questions.map((q: { id: string; correctAnswer: number }, i: number) => {
      const isCorrect = answers[i] === q.correctAnswer
      if (isCorrect) score++
      return { questionId: q.id, correct: isCorrect, correctAnswer: q.correctAnswer }
    })

    // Primary: save quiz result (this is the critical operation)
    const quizSave = await safeDb(
      () =>
        prisma.quizResult.create({
          data: {
            userId: session.user.id,
            score,
            totalQuestions: questions.length,
          },
        }),
      null
    )

    // Secondary: update learning streak (non-blocking)
    const today = getTodayUTC()
    safeDb(
      () =>
        prisma.learningStreak.upsert({
          where: { userId_date: { userId: session.user.id, date: today } },
          update: { count: { increment: 1 } },
          create: { userId: session.user.id, date: today, count: 1 },
        }),
      null
    ).catch(() => {})

    // Secondary: check and award achievements (non-blocking)
    safeDb(() => checkAndAwardAchievements(session.user.id), undefined).catch(() => {})

    return NextResponse.json({
      score,
      total: questions.length,
      results,
      saved: quizSave !== null,
    })
  } catch (err) {
    console.error('[QUIZ] Submit error:', err)
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 })
  }
}

async function checkAndAwardAchievements(userId: string) {
  const [existing, quizCount, streakCount, progressCount] = await Promise.all([
    prisma.achievement.findMany({ where: { userId }, select: { type: true } }),
    prisma.quizResult.count({ where: { userId } }).catch(() => 0),
    prisma.learningStreak.count({ where: { userId } }).catch(() => 0),
    prisma.progress.count({ where: { userId, completed: true } }).catch(() => 0),
  ])

  const existingTypes = new Set(existing.map((a) => a.type))

  const newAchievements: { type: string; title: string; description: string }[] = []

  if (quizCount >= 1 && !existingTypes.has('first-quiz')) {
    newAchievements.push({ type: 'first-quiz', title: 'First Steps', description: 'Completed your first quiz' })
  }
  if (quizCount >= 5 && !existingTypes.has('quiz-master')) {
    newAchievements.push({ type: 'quiz-master', title: 'Quiz Master', description: 'Completed 5 quizzes' })
  }
  if (quizCount >= 20 && !existingTypes.has('quiz-legend')) {
    newAchievements.push({ type: 'quiz-legend', title: 'Quiz Legend', description: 'Completed 20 quizzes' })
  }
  if (streakCount >= 3 && !existingTypes.has('streak-3')) {
    newAchievements.push({ type: 'streak-3', title: 'Getting Started', description: '3-day learning streak' })
  }
  if (streakCount >= 7 && !existingTypes.has('streak-7')) {
    newAchievements.push({ type: 'streak-7', title: 'Week Warrior', description: '7-day learning streak' })
  }
  if (streakCount >= 30 && !existingTypes.has('streak-30')) {
    newAchievements.push({ type: 'streak-30', title: 'Monthly Master', description: '30-day learning streak' })
  }
  if (progressCount >= 5 && !existingTypes.has('explorer')) {
    newAchievements.push({ type: 'explorer', title: 'Explorer', description: 'Learned 5 concepts' })
  }
  if (progressCount >= 20 && !existingTypes.has('scholar')) {
    newAchievements.push({ type: 'scholar', title: 'Scholar', description: 'Learned 20 concepts' })
  }
  if (progressCount >= 50 && !existingTypes.has('expert')) {
    newAchievements.push({ type: 'expert', title: 'Expert', description: 'Learned 50 concepts' })
  }
  if (progressCount >= 100 && !existingTypes.has('master')) {
    newAchievements.push({ type: 'master', title: 'Master', description: 'Learned 100 concepts' })
  }

  if (newAchievements.length > 0) {
    await prisma.achievement.createMany({
      data: newAchievements.map((a) => ({ userId, ...a })),
    })
  }
}
