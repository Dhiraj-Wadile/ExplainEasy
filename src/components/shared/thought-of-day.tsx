'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Quote, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BusinessQuote } from '@/types'

interface Thought extends BusinessQuote {
  isAiGenerated?: boolean
}

interface ThoughtOfDayProps {
  initialQuote: BusinessQuote
  quotesPool: BusinessQuote[]
}

export function ThoughtOfDay({ initialQuote, quotesPool }: ThoughtOfDayProps) {
  const [thoughts, setThoughts] = useState<Thought[]>([{ ...initialQuote, isAiGenerated: false }])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const poolIndexRef = useRef(Math.floor(Math.random() * quotesPool.length))
  const preFetchQueue = useRef<Thought[]>([])

  useEffect(() => {
    preFetchThoughts()
  }, [])

  async function preFetchThoughts() {
    try {
      const res = await fetch('/api/ai/thought', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.text && data.author) {
          preFetchQueue.current.push({
            id: `ai-${Date.now()}`,
            text: data.text,
            author: data.author,
            role: data.role || '',
            company: data.company || '',
            isAiGenerated: true,
          })
        }
      }
    } catch { /* offline fallback */ }
  }

  const currentThought = thoughts[currentIndex]

  const addThought = useCallback((thought: Thought) => {
    setThoughts(prev => [...prev, thought].slice(-20))
    setCurrentIndex(prev => prev + 1)
  }, [])

  const generateNext = useCallback(async () => {
    if (currentIndex < thoughts.length - 1) {
      setCurrentIndex(i => i + 1)
      return
    }

    const nextPoolIdx = (poolIndexRef.current + 1) % quotesPool.length
    poolIndexRef.current = nextPoolIdx
    const localQuote = quotesPool[nextPoolIdx]

    if (preFetchQueue.current.length > 0) {
      const aiThought = preFetchQueue.current.shift()!
      addThought(aiThought)
      preFetchThoughts()
      return
    }

    if (localQuote) {
      addThought({ ...localQuote, isAiGenerated: false })
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/thought', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.text && data.author) {
          setThoughts(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last && !last.isAiGenerated && last.text !== data.text) {
              updated[updated.length - 1] = {
                id: `ai-${Date.now()}`,
                text: data.text,
                author: data.author,
                role: data.role || '',
                company: data.company || '',
                isAiGenerated: true,
              }
            }
            return updated
          })
        }
      }
    } catch {
      // local quote already shown
    } finally {
      setIsLoading(false)
    }
  }, [currentIndex, thoughts.length, quotesPool, addThought])

  const goBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }, [currentIndex])

  if (!currentThought) return null

  return (
    <section className="section-padding pt-0">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <div key={`${currentThought.id}-${currentIndex}`} className="animate-fade-in">
            <Quote className="w-7 h-7 mx-auto mb-4 text-primary/30" />
            <blockquote className="heading-md mb-4 italic text-foreground/80 leading-relaxed">
              &ldquo;{currentThought.text}&rdquo;
            </blockquote>
            <p className="font-medium text-primary">
              &mdash; {currentThought.author}
            </p>
            {(currentThought.role || currentThought.company) && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentThought.role}
                {currentThought.role && currentThought.company ? ', ' : ''}
                {currentThought.company}
              </p>
            )}
            {currentThought.isAiGenerated && (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-amber-500 font-medium">AI Generated</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateNext}
              disabled={isLoading}
              className="gap-1.5"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {isLoading ? 'Generating...' : 'Next Thought'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3 tabular-nums">
            Thought {currentIndex + 1} of {thoughts.length}
          </p>
        </div>
      </div>
    </section>
  )
}
