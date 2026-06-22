'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, FormEvent, useEffect } from 'react'
import {
  Sparkles,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react'
import { categories } from '@/data/categories'
import { popularTerms, getDailyTerm, allTerms } from '@/data/index'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/motion'
import { getIcon } from '@/lib/icons'
import { getDailyQuote, quotes } from '@/data/quotes'
import { ThoughtOfDay } from '@/components/shared/thought-of-day'

const searchExamples = [
  'What is EBITDA?',
  'What is RAG?',
  'How does UPI work?',
  'What is MVP?',
  'What is Machine Learning?',
]

function SearchPlaceholder({ examples }: { examples: string[] }) {
  const [, setIndex] = useState(0)
  const [text, setText] = useState(examples[0])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % examples.length
        setText(examples[next])
        return next
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [examples, setIndex])

  return (
    <span className="text-muted-foreground/60" key={text}>
      {text}
    </span>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const dailyTerm = getDailyTerm() ?? allTerms[0]
  const dailyQuote = getDailyQuote()

  return (
    <main className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="section-padding pb-0">
        <div className="max-w-3xl mx-auto text-center px-4">
          <FadeInUp>
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <Sparkles className="w-3 h-3" />
                AI-Powered Learning
              </span>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.05}>
            <h1 className="heading-xl mb-3 leading-[1.05]">
              Learn Anything.<br />
              <span className="gradient-text">Understand Everything.</span>
            </h1>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              The fastest way to learn AI, Business, Finance &amp; Technology through simple, smart explanations.
            </p>
          </FadeInUp>

          {/* Search — hero CTA */}
          <FadeInUp delay={0.15}>
            <div className="max-w-xl mx-auto mb-6">
              <div
                className="relative flex items-center bg-card border rounded-2xl transition-all duration-300"
                style={{
                  borderColor: searchFocused ? 'var(--primary)' : 'var(--border)',
                  boxShadow: searchFocused
                    ? '0 0 0 3px rgba(124,108,242,0.12), 0 8px 32px rgba(124,108,242,0.08)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder=" "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    }
                  }}
                  className="w-full h-14 pl-12 pr-4 bg-transparent text-foreground text-base outline-none rounded-2xl"
                />
                {!searchQuery && (
                  <span className="absolute left-12 pointer-events-none text-base truncate max-w-[80%]">
                    <SearchPlaceholder examples={searchExamples} />
                  </span>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 mr-3 px-2 py-1 rounded-lg bg-muted/50 border border-border text-[11px] text-muted-foreground shrink-0">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </FadeInUp>

          {/* Trust badges */}
          <FadeInUp delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Simple Explanations
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Real Examples
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Interview Questions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Daily Learning
              </span>
            </div>
          </FadeInUp>

          {/* CTA buttons */}
          <FadeInUp delay={0.25}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <Link href="/categories">
                <Button size="lg" className="px-8 h-12 text-base">
                  Browse Concepts <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href={`/terms/${dailyTerm.slug}`}>
                <Button variant="outline" size="lg" className="px-8 h-12 text-base">
                  Daily Concept
                </Button>
              </Link>
            </div>
          </FadeInUp>

          {/* Stats */}
          <FadeInUp delay={0.3}>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-2xl font-bold text-foreground tabular-nums">{allTerms.length}+</div>
                <div className="text-xs text-muted-foreground mt-0.5">Concepts Explained</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-2xl font-bold text-foreground tabular-nums">{categories.length}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Learning Categories</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-2xl font-bold text-foreground">AI</div>
                <div className="text-xs text-muted-foreground mt-0.5">Powered Learning</div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Daily Concept ─── */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInUp>
            <Card className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    <Sparkles className="w-4 h-4" />
                    Daily Concept
                  </div>
                  <h2 className="heading-md">{dailyTerm.name}</h2>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">
                    {dailyTerm.definition}
                  </p>
                  <Link href={`/terms/${dailyTerm.slug}`}>
                    <Button variant="ghost" className="gap-1.5 p-0 h-auto text-primary hover:text-primary/80">
                      Read full explanation <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <Badge variant="primary" className="text-sm px-4 py-1.5 self-start shrink-0">
                  {dailyTerm.category}
                </Badge>
              </div>
            </Card>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="section-padding pt-0">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-md mb-1">Explore Categories</h2>
                <p className="text-muted-foreground">Find your area of interest</p>
              </div>
              <Link href="/categories">
                <Button variant="ghost" className="gap-1.5">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((category) => {
              const IconComp = getIcon(category.icon)
              return (
                <StaggerItem key={category.slug}>
                  <Link href={`/categories/${category.slug}`}>
                    <Card className="p-6 h-full flex flex-col items-center text-center gap-4 cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <IconComp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                      <span className="text-xs text-primary font-medium tabular-nums">
                        {category.termCount} concepts
                      </span>
                    </Card>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Popular Concepts ─── */}
      {popularTerms.length > 0 && (
        <section className="section-padding pt-0">
          <div className="max-w-6xl mx-auto px-4">
            <FadeInUp>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="heading-md mb-1">Popular Concepts</h2>
                  <p className="text-muted-foreground">Most viewed business terms</p>
                </div>
                <Link href="/search?sort=popular">
                  <Button variant="ghost" className="gap-1.5">
                    View All <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </FadeInUp>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTerms.slice(0, 9).map((term) => (
                <StaggerItem key={term.slug}>
                  <Link href={`/terms/${term.slug}`}>
                    <Card className="p-5 h-full flex flex-col gap-3 cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="primary" className="text-xs">{term.category}</Badge>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {term.difficulty}
                        </Badge>
                      </div>
                      <h3 className="font-semibold">{term.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {term.definition}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{term.readTime || 3} min read</span>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ─── Quote ─── */}
      {dailyQuote && <ThoughtOfDay initialQuote={dailyQuote} quotesPool={quotes} />}

      {/* ─── Newsletter ─── */}
      <section className="section-padding pt-0">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeInUp>
            <Card className="p-10 md:p-12">
              <Zap className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h2 className="heading-md mb-2">Stay Ahead</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Get a daily business concept delivered to your inbox every morning.
              </p>
              <NewsletterForm />
            </Card>
          </FadeInUp>
        </div>
      </section>
    </main>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Subscribed successfully!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3 py-4"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        <p className="font-medium text-emerald-400">{message}</p>
        <p className="text-xs text-muted-foreground">Free forever. No spam. Unsubscribe anytime.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
          placeholder="Enter your email"
          className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 transition-colors"
        />
        <Button type="submit" disabled={status === 'loading'} className="h-11 gap-2">
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1.5 text-xs text-red-500 mt-3"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {message}
        </motion.p>
      )}
      {status === 'idle' && (
        <p className="text-xs text-muted-foreground mt-3">Free forever. No spam. Unsubscribe anytime.</p>
      )}
    </form>
  )
}
