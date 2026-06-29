'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'
import { useRouter } from 'next/navigation'

interface MarkLearnedProps {
  conceptSlug: string
}

export function MarkLearned({ conceptSlug }: MarkLearnedProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [learned, setLearned] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    fetch('/api/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.progress) {
          setLearned(data.progress.includes(conceptSlug))
        }
      })
      .catch(() => {})
  }, [isAuthenticated, conceptSlug])

  async function handleToggle() {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      if (learned) {
        const res = await fetch('/api/progress/mark-learned', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conceptSlug }),
        })
        if (res.ok) {
          setLearned(false)
        }
      } else {
        const res = await fetch('/api/progress/mark-learned', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conceptSlug }),
        })
        if (res.ok) {
          setLearned(true)
        }
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Circle className="h-4 w-4" />
        <span>Mark as Learned</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        learned
          ? 'text-emerald-500'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {learned ? (
        <CheckCircle className="h-4 w-4 fill-emerald-500 text-white" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      <span>{learned ? 'Learned' : 'Mark as Learned'}</span>
    </button>
  )
}
