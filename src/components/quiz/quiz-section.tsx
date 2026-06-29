'use client'

import { useState, useEffect } from 'react'
import { Brain, CheckCircle, XCircle, RefreshCw, ArrowRight, Trophy } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizSectionProps {
  conceptSlug: string
  conceptName: string
}

export function QuizSection({ conceptSlug, conceptName }: QuizSectionProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadQuiz()
  }, [conceptSlug])

  async function loadQuiz() {
    setLoading(true)
    setError('')
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    try {
      const res = await fetch(`/api/quiz/${conceptSlug}`)
      if (!res.ok) throw new Error('Failed to load quiz')
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch {
      setError('Could not load quiz questions')
    } finally {
      setLoading(false)
    }
  }

  function handleAnswer(questionId: string, optionIndex: number) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  async function handleSubmit() {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptSlug,
          answers: questions.map((q) => answers[q.id]),
          questions: questions.map((q) => ({ id: q.id, correctAnswer: q.correctAnswer })),
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      const data = await res.json()
      setScore(data.score)
      setSubmitted(true)
    } catch {
      setError('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="rounded-2xl border border-border p-8 text-center">
        <p className="text-muted-foreground">{error}</p>
        <button onClick={loadQuiz} className="mt-3 text-sm text-primary hover:underline">
          Try again
        </button>
      </div>
    )
  }

  if (questions.length === 0) return null

  const allAnswered = Object.keys(answers).length === questions.length

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border bg-primary/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Knowledge Check</h3>
            <p className="text-sm text-muted-foreground">Test your understanding of {conceptName}</p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="p-6 space-y-6">
          <div className="text-center py-6">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-amber-500" />
            <div className="text-3xl font-bold mb-1">{score}/{questions.length}</div>
            <p className="text-muted-foreground">
              {score === questions.length
                ? 'Perfect score! You truly understand this concept.'
                : score >= questions.length / 2
                  ? 'Good job! Review the ones you missed.'
                  : 'Keep learning! Try again after reviewing.'}
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const isCorrect = answers[q.id] === q.correctAnswer
              return (
                <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : 'border-red-500/30 bg-red-500/[0.03]'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-2">{i + 1}. {q.question}</p>
                      <p className="text-xs text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={loadQuiz}
            className="flex items-center gap-2 mx-auto text-sm text-primary hover:underline"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Quiz
          </button>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {questions.map((q, i) => (
            <div key={q.id}>
              <p className="font-medium text-sm mb-3">{i + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, oi) => {
                  const isSelected = answers[q.id] === oi
                  return (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(q.id, oi)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/30 hover:bg-accent'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium mr-3 shrink-0">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              {Object.keys(answers).length}/{questions.length} answered
              {!isAuthenticated && ' (sign in to submit)'}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting || !isAuthenticated}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all disabled:opacity-40"
            >
              {submitting ? 'Submitting...' : 'Submit Answers'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
