import Link from 'next/link'
import {
  Sparkles,
  BookOpen,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { categories } from '@/data/categories'
import { popularTerms, getDailyTerm, allTerms, getTermCountForCategory } from '@/data/index'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/motion'
import { getIcon } from '@/lib/icons'
import { getDailyQuote, quotes } from '@/data/quotes'
import { ThoughtOfDay } from '@/components/shared/thought-of-day'
import { HeroSearch } from '@/components/home/hero-search'
import { NewsletterForm } from '@/components/home/newsletter-form'

const CONCEPT_COUNT = allTerms.length

export default function HomePage() {
  const dailyTerm = getDailyTerm() ?? allTerms[0]
  const dailyQuote = getDailyQuote()

  return (
    <main className="min-h-screen">
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

          <FadeInUp delay={0.15}>
            <div className="max-w-xl mx-auto mb-6">
              <HeroSearch />
            </div>
          </FadeInUp>

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

          <FadeInUp delay={0.25}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 h-12 px-7 text-base gap-2.5 bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20 active:scale-[0.97]"
              >
                Browse Concepts <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <Link
                href={`/terms/${dailyTerm.slug}`}
                className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 h-12 px-7 text-base gap-2.5 border border-border bg-transparent hover:bg-white/5 hover:border-muted-foreground/30 active:scale-[0.97]"
              >
                Daily Concept
              </Link>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-2xl font-bold text-foreground tabular-nums">{CONCEPT_COUNT}+</div>
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
                  <Link
                    href={`/terms/${dailyTerm.slug}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 rounded-xl font-medium transition-colors text-sm"
                  >
                    Read full explanation <ChevronRight className="w-4 h-4" />
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

      <section className="section-padding pt-0">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-md mb-1">Explore Categories</h2>
                <p className="text-muted-foreground">Find your area of interest</p>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 h-10 px-5 text-sm gap-2 hover:bg-white/5 text-muted-foreground hover:text-foreground"
              >
                View All Categories <ChevronRight className="w-4 h-4" />
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
                        {getTermCountForCategory(category.name)} concepts
                      </span>
                    </Card>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {popularTerms.length > 0 && (
        <section className="section-padding pt-0">
          <div className="max-w-6xl mx-auto px-4">
            <FadeInUp>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="heading-md mb-1">Popular Concepts</h2>
                  <p className="text-muted-foreground">Most viewed business terms</p>
                </div>
              <Link
                href="/search?sort=popular"
                className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 h-10 px-5 text-sm gap-2 hover:bg-white/5 text-muted-foreground hover:text-foreground"
              >
                View All Concepts <ChevronRight className="w-4 h-4" />
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

      {dailyQuote && <ThoughtOfDay initialQuote={dailyQuote} quotesPool={quotes} />}

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
