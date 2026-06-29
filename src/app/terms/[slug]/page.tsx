'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Lightbulb, Target, CheckCircle, HelpCircle, Bookmark, Share2, Clock, ChevronRight, FileText, Brain, Zap, Star } from 'lucide-react'
import { getTermBySlug, getTermsByCategory } from '@/data'
import { Badge } from '@/components/ui/badge'
import { FadeInUp } from '@/components/shared/motion-wrapper'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { useFavoritesStore } from '@/lib/store'
import { useEffect } from 'react'
import { MarkLearned } from '@/components/learn/mark-learned'
import { ReadingProgress } from '@/components/learn/reading-progress'
import { QuizSection } from '@/components/quiz/quiz-section'
import { useChatContext } from '@/lib/store'

export default function ConceptPage() {
  const params = useParams()
  const concept = getTermBySlug(params.slug as string)
  const [activeTab, setActiveTab] = useState('overview')
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const { setConcept } = useChatContext()

  useEffect(() => {
    if (concept) {
      setConcept({ name: concept.name, slug: concept.slug, definition: concept.definition, category: concept.category })
    }
    return () => setConcept(null)
  }, [concept, setConcept])

  if (!concept) {
    notFound()
  }

  const related = getTermsByCategory(concept.category).filter((t) => t.id !== concept.id).slice(0, 4)
  const readTime = concept.readTime || Math.ceil(concept.definition.split(' ').length / 200)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'explain', label: 'Simple Explanation', icon: Lightbulb },
    { id: 'details', label: 'Deep Dive', icon: Brain },
    { id: 'interview', label: 'Interview Prep', icon: Target },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'quiz', label: 'Quiz', icon: Brain },
  ]

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Badge variant="primary">{concept.category}</Badge>
                {concept.difficulty && (
                  <Badge variant={concept.difficulty === 'Beginner' ? 'success' : concept.difficulty === 'Intermediate' ? 'warning' : 'info'}>
                    {concept.difficulty}
                  </Badge>
                )}
                {concept.popular && <Badge variant="default">Popular</Badge>}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{concept.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{concept.definition}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{readTime} min read</span>
            </div>
            <MarkLearned conceptSlug={concept.slug} />
            <button
              onClick={() => isFavorite(concept.slug) ? removeFavorite(concept.slug) : addFavorite(concept.slug)}
              className={`flex items-center gap-1.5 transition-colors ${isFavorite(concept.slug) ? 'text-primary' : 'hover:text-foreground text-muted-foreground'}`}
            >
              <Bookmark className={`h-4 w-4 ${isFavorite(concept.slug) ? 'fill-primary' : ''}`} />
              <span>{isFavorite(concept.slug) ? 'Saved' : 'Save'}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="border-b border-border sticky top-16 bg-background z-30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label === 'Simple Explanation' ? 'Simple' : tab.label === 'Interview Prep' ? 'Interview' : tab.label === 'Deep Dive' ? 'Deep' : tab.label === 'Overview' ? 'Overview' : 'FAQ'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        {activeTab === 'overview' && (
          <FadeInUp key="overview">
            <div className="space-y-8">
              <Section title="What is it?">
                <p className="text-muted-foreground leading-relaxed">{concept.definition}</p>
              </Section>

              <Section title="Quick Summary">
                <div className="rounded-2xl border border-border bg-primary/[0.03] p-6">
                  <p className="text-lg leading-relaxed font-medium">
                    {concept.quickSummary || concept.simpleExplanation}
                  </p>
                </div>
              </Section>

              <Section title="Why it Matters">
                <p className="text-muted-foreground leading-relaxed">{concept.whyItMatters}</p>
              </Section>

              {concept.visualDiagram && (
                <Section title="Visual Diagram">
                  <div className="rounded-2xl border border-border bg-muted/50 p-6 font-mono text-sm leading-relaxed">
                    {concept.visualDiagram}
                  </div>
                </Section>
              )}

              {concept.formula && (
                <Section title="Formula">
                  <div className="rounded-2xl border border-border bg-amber-500/[0.03] p-6">
                    <div className="text-xl font-mono font-bold text-center py-4">{concept.formula}</div>
                    {concept.formulaDescription && (
                      <p className="text-sm text-muted-foreground mt-3">{concept.formulaDescription}</p>
                    )}
                  </div>
                </Section>
              )}

              {concept.realCompanyExample && (
                <Section title="Real Company Example">
                  <div className="rounded-2xl border border-border bg-emerald-500/[0.03] p-6">
                    <p className="text-muted-foreground leading-relaxed">{concept.realCompanyExample}</p>
                  </div>
                </Section>
              )}

              {concept.commonMistakes && concept.commonMistakes.length > 0 && (
                <Section title="Common Mistakes">
                  <ul className="space-y-3">
                    {concept.commonMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 text-xs font-bold mt-0.5">
                          !
                        </div>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="Related Concepts">
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/terms/${r.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-accent transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{r.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.category}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </Section>
            </div>
          </FadeInUp>
        )}

        {activeTab === 'explain' && (
          <FadeInUp key="explain">
            <div className="space-y-8">
              <Section title="Simple Explanation">
                <div className="rounded-2xl border border-border bg-primary/[0.03] p-6 sm:p-8">
                  <Lightbulb className="h-8 w-8 text-primary mb-4" />
                  <p className="text-xl leading-relaxed font-medium">{concept.simpleExplanation}</p>
                </div>
              </Section>

              <Section title="Real-World Example">
                <div className="rounded-2xl border border-border bg-blue-500/[0.03] p-6">
                  <Zap className="h-6 w-6 text-primary mb-3" />
                  <p className="text-muted-foreground leading-relaxed">{concept.example}</p>
                </div>
              </Section>

              {concept.sharkTankExample && (
                <Section title="Shark Tank Example">
                  <div className="rounded-2xl border border-border bg-amber-500/[0.03] p-6">
                    <Star className="h-6 w-6 text-amber-500 mb-3" />
                    <p className="text-muted-foreground leading-relaxed">{concept.sharkTankExample}</p>
                  </div>
                </Section>
              )}
            </div>
          </FadeInUp>
        )}

        {activeTab === 'details' && (
          <FadeInUp key="details">
            <div className="space-y-8">
              <Section title="Deep Dive">
                <div className="prose-custom">
                  <p className="text-muted-foreground leading-relaxed">{concept.definition}</p>
                </div>
              </Section>

              {concept.formula && (
                <Section title="The Formula">
                  <div className="rounded-2xl border border-border bg-amber-500/[0.03] p-6">
                    <div className="text-2xl font-mono font-bold text-center py-6">{concept.formula}</div>
                    {concept.formulaDescription && (
                      <p className="text-sm text-muted-foreground">{concept.formulaDescription}</p>
                    )}
                  </div>
                </Section>
              )}

              <Section title="References">
                <ul className="space-y-2">
                  {concept.references.map((ref, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          </FadeInUp>
        )}

        {activeTab === 'interview' && (
          <FadeInUp key="interview">
            <div className="space-y-8">
              <Section title="Interview Questions">
                <div className="space-y-4">
                  {concept.interviewQuestions.map((q, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 hover:bg-accent transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium">{q}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Tips for Answering">
                <div className="rounded-2xl border border-border bg-emerald-500/[0.03] p-6">
                  <Target className="h-6 w-6 text-emerald-500 mb-3" />
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Start with a clear definition</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Provide a real-world example</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Explain why it matters practically</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Connect to your own experience if possible</span>
                    </li>
                  </ul>
                </div>
              </Section>
            </div>
          </FadeInUp>
        )}

        {activeTab === 'quiz' && (
          <FadeInUp key="quiz">
            <QuizSection conceptSlug={concept.slug} conceptName={concept.name} />
          </FadeInUp>
        )}

        {activeTab === 'faq' && (
          <FadeInUp key="faq">
            <Section title="Frequently Asked Questions">
              <div className="space-y-4">
                {concept.faqs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-border overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent transition-colors list-none">
                      <span className="font-medium text-sm pr-4">{faq.question}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </Section>
          </FadeInUp>
        )}
      </div>

      {/* Related Concepts Footer */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h3 className="font-semibold mb-4">Continue Learning</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/terms/${r.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.simpleExplanation}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </section>
  )
}
