'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { getTermsByCategory } from '@/data'
import { getCategoryBySlug } from '@/data/categories'
import { Badge } from '@/components/ui/badge'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper'

export default function CategoryPage() {
  const params = useParams()
  const category = getCategoryBySlug(params.slug as string)
  const terms = getTermsByCategory(category?.name || '')

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <h1 className="text-4xl font-bold">Category not found</h1>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Go back home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">{category.description}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            <span>{terms.length} concepts</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {terms.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No concepts in this category yet. Check back soon!</p>
          </div>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <StaggerItem key={term.id}>
                <Link href={`/terms/${term.slug}`} className="group block">
                  <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {term.popular && <Badge variant="success">Popular</Badge>}
                      <Badge variant={term.difficulty === 'Beginner' ? 'success' : term.difficulty === 'Intermediate' ? 'warning' : 'info'}>
                        {term.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{term.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{term.simpleExplanation}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{term.readTime || 3} min read</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  )
}
