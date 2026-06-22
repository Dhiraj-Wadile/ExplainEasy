'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { categories } from '@/data/categories'
import { getTermCountForCategory } from '@/data'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper'
import { getIcon } from '@/lib/icons'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Categories</h1>
          <p className="mt-2 text-muted-foreground">Choose a topic to start learning</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link href={`/categories/${cat.slug}`} className="group block">
                <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    {(() => {
                      const IC = getIcon(cat.icon)
                      return <IC className="h-6 w-6 text-primary" />
                    })()}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <span>{getTermCountForCategory(cat.name)} concepts</span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  )
}
