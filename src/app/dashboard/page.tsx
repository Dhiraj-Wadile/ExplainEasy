'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/auth-context'
import {
  BookOpen, ChevronRight, Flame, Trophy, Brain, BarChart3, ArrowLeft,
  Target, Zap, Sparkles, Clock, CheckCircle2, Star, BookMarked
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/motion'
import { AchievementBadge } from '@/components/learn/achievement-badge'
import { allTerms, getTermBySlug } from '@/data'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardData {
  stats: {
    totalConcepts: number
    learnedConcepts: number
    progressPercentage: number
    currentStreak: number
    bookmarkCount: number
    totalQuizAttempts: number
    avgScore: number
  }
  achievements: { id: string; type: string; title: string; description: string | null; earnedAt: string }[]
  recentlyViewed: string[]
  interests: string[]
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    fetch('/api/user/dashboard')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated, isLoading])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-md mx-auto px-4 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="heading-md mb-2">Sign in to view your dashboard</h1>
          <p className="text-muted-foreground mb-6">Track your progress, achievements, and learning streaks.</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all"
          >
            Sign In
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-md mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-primary hover:underline text-sm">
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { stats, achievements, recentlyViewed, interests } = data

  const recentConcepts = recentlyViewed
    .map((slug) => getTermBySlug(slug))
    .filter(Boolean)

  return (
    <main className="min-h-screen section-padding">
      <div className="max-w-5xl mx-auto px-4">
        <FadeInUp>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
              {user?.image ? (
                <img src={user.image} alt="" className="w-14 h-14 rounded-2xl" />
              ) : (
                <BarChart3 className="w-7 h-7 text-primary" />
              )}
            </div>
            <div>
              <h1 className="heading-md">
                {user?.name ? `${user.name}'s Dashboard` : 'Your Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground">Track your learning journey</p>
            </div>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StaggerItem>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums">{stats.learnedConcepts}<span className="text-sm text-muted-foreground font-normal">/{stats.totalConcepts}</span></div>
              <p className="text-xs text-muted-foreground mt-0.5">Concepts Learned</p>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stats.progressPercentage}%` }} />
              </div>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums">{stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Day Streak</p>
              {(stats.currentStreak >= 3) && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-500 font-medium">
                  <Sparkles className="w-3 h-3" /> Keep going!
                </div>
              )}
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums">{stats.totalQuizAttempts}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Quizzes Taken</p>
              {stats.totalQuizAttempts > 0 && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-medium">
                  <Target className="w-3 h-3" /> Avg {stats.avgScore}%
                </div>
              )}
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums">{achievements.length}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Achievements</p>
              <Link href="/learn" className="flex items-center gap-1 mt-2 text-[10px] text-primary font-medium hover:underline">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {achievements.length > 0 && (
              <FadeInUp>
                <div>
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Recent Achievements
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {achievements.slice(0, 5).map((a) => (
                      <AchievementBadge key={a.id} type={a.type} title={a.title} description={a.description} earnedAt={a.earnedAt} />
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {recentConcepts.length > 0 && (
              <FadeInUp>
                <div>
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recently Viewed
                  </h2>
                  <div className="grid gap-3">
                    {recentConcepts.map((c) => c && (
                      <Link
                        key={c.slug}
                        href={`/terms/${c.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-accent transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.definition}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {!data?.stats?.learnedConcepts && !achievements.length && (
              <FadeInUp>
                <Card className="p-8 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Start Your Learning Journey</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse concepts, take quizzes, and earn achievements as you learn.
                  </p>
                  <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
                  >
                    Browse Concepts <ChevronRight className="w-4 h-4" />
                  </Link>
                </Card>
              </FadeInUp>
            )}
          </div>

          <div className="space-y-6">
            {interests.length > 0 && (
              <FadeInUp>
                <Card className="p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Your Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((i) => (
                      <Badge key={i} variant="primary" className="text-xs">{i}</Badge>
                    ))}
                  </div>
                </Card>
              </FadeInUp>
            )}

            <FadeInUp>
              <Card className="p-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link href="/categories" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent">
                    <BookOpen className="w-4 h-4" /> Browse all concepts
                  </Link>
                  <Link href="/search" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent">
                    <Zap className="w-4 h-4" /> Search concepts
                  </Link>
                  <Link href="/learn" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent">
                    <BookMarked className="w-4 h-4" /> Learning tools
                  </Link>
                </div>
              </Card>
            </FadeInUp>

            {stats.progressPercentage > 0 && (
              <FadeInUp>
                <Card className="p-5">
                  <h3 className="font-semibold text-sm mb-3">Progress Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Overall</span>
                        <span className="font-medium">{stats.progressPercentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stats.progressPercentage}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Your goal</span>
                      <span className="font-medium text-emerald-500">
                        {stats.learnedConcepts >= 100 ? 'Master' : stats.learnedConcepts >= 50 ? 'Expert' : stats.learnedConcepts >= 20 ? 'Scholar' : stats.learnedConcepts >= 5 ? 'Explorer' : 'Beginner'}
                      </span>
                    </div>
                  </div>
                </Card>
              </FadeInUp>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
