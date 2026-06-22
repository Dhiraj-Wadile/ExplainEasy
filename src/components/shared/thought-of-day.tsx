'use client'

import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const poolIndexRef = useRef(0)

  const currentThought = thoughts[currentIndex]

  const generateNext = useCallback(async () => {
    if (currentIndex < thoughts.length - 1) {
      setCurrentIndex(i => i + 1)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/thought', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        const newThought: Thought = {
          id: `ai-${Date.now()}`,
          text: data.text,
          author: data.author,
          role: data.role || '',
          company: data.company || '',
          isAiGenerated: true,
        }
        setThoughts(prev => [...prev, newThought].slice(-50))
        setCurrentIndex(prev => prev + 1)
        setIsLoading(false)
        return
      }
    } catch (err) {
      console.error('Failed to fetch AI thought:', err)
    }
    if (quotesPool.length === 0) {
      setIsLoading(false)
      return
    }
    const nextIndex = (poolIndexRef.current + 1) % quotesPool.length
    poolIndexRef.current = nextIndex
    const q = quotesPool[nextIndex]
    if (!q) {
      setIsLoading(false)
      return
    }
    setThoughts(prev => [...prev, { ...q, isAiGenerated: false }].slice(-50))
    setCurrentIndex(prev => prev + 1)
    setIsLoading(false)
  }, [currentIndex, thoughts.length, quotesPool])

  const goBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }, [currentIndex])

  if (!currentThought) return null

  return (
    <section className="section-padding pt-0">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentThought.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
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
            </motion.div>
          </AnimatePresence>

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
