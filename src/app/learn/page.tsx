'use client'

import { Brain, Zap, BookOpen, BarChart3, Flame, Trophy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion'

const features = [
  {
    icon: BookOpen,
    title: 'Bookmarks',
    description: 'Save concepts to revisit later. Build your personal knowledge library.',
  },
  {
    icon: Zap,
    title: 'Flashcards',
    description: 'Test your knowledge with smart flashcards. Spaced repetition for better retention.',
  },
  {
    icon: Brain,
    title: 'Quizzes',
    description: 'Challenge yourself with topic-wise quizzes. Track your scores and improve.',
  },
  {
    icon: Flame,
    title: 'Learning Streaks',
    description: 'Stay consistent with daily learning streaks. Never break the chain!',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Earn badges and achievements as you master new concepts.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and insights.',
  },
]

export default function LearnPage() {
  return (
    <main className="min-h-screen">
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            Interactive Learning
          </div>
          <h1 className="heading-xl mb-4">Learn Your Way</h1>
          <p className="body-lg max-w-2xl mx-auto">
            Master business concepts with flashcards, quizzes, and track your progress.
          </p>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="max-w-6xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <Card className="p-6 h-full hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  )
}
