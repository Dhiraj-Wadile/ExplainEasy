'use client'

import { Trophy, Zap, BookOpen, Star, Target, Flame, Brain, Sparkles } from 'lucide-react'

const achievementConfig: Record<string, { icon: typeof Trophy; label: string; color: string }> = {
  'first-quiz': { icon: Star, label: 'First Quiz', color: 'text-amber-500' },
  'quiz-master': { icon: Brain, label: 'Quiz Master', color: 'text-purple-500' },
  'quiz-legend': { icon: Trophy, label: 'Quiz Legend', color: 'text-yellow-500' },
  'streak-3': { icon: Flame, label: '3-Day Streak', color: 'text-orange-500' },
  'streak-7': { icon: Flame, label: 'Week Warrior', color: 'text-red-500' },
  'streak-30': { icon: Target, label: 'Monthly Master', color: 'text-rose-500' },
  explorer: { icon: BookOpen, label: 'Explorer', color: 'text-blue-500' },
  scholar: { icon: Brain, label: 'Scholar', color: 'text-indigo-500' },
  expert: { icon: Zap, label: 'Expert', color: 'text-emerald-500' },
  master: { icon: Trophy, label: 'Master', color: 'text-primary' },
}

interface AchievementBadgeProps {
  type: string
  title: string
  description?: string | null
  earnedAt?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementBadge({ type, title, description, earnedAt, size = 'md' }: AchievementBadgeProps) {
  const config = achievementConfig[type]
  const Icon = config?.icon || Trophy
  const color = config?.color || 'text-primary'

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  }

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-lg`}>
        <Icon className={`${iconSizes[size]} ${color}`} />
      </div>
      <div className="text-center">
        <p className="font-semibold text-xs">{title}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground leading-tight max-w-[120px]">{description}</p>
        )}
        {earnedAt && (
          <p className="text-[9px] text-muted-foreground mt-0.5">
            {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

export function AllAchievements() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {Object.entries(achievementConfig).map(([type, config]) => {
        const Icon = config.icon
        return (
          <div key={type} className="flex flex-col items-center gap-1.5 opacity-40 grayscale">
            <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium text-center">{config.label}</p>
          </div>
        )
      })}
    </div>
  )
}
