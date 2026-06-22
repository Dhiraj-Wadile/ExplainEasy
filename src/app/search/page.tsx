'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, Clock, X } from 'lucide-react'
import { allTerms } from '@/data'
import { categories } from '@/data/categories'
import { Badge } from '@/components/ui/badge'
import { GlossaryFilters } from '@/types'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper'

export default function SearchPage() {
  const [filters, setFilters] = useState<GlossaryFilters>({
    search: '',
    category: 'all',
    difficulty: 'all',
    sortBy: 'name',
  })

  const filteredTerms = useMemo(() => {
    let result = [...allTerms]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category)
    }

    if (filters.difficulty !== 'all') {
      result = result.filter((t) => t.difficulty === filters.difficulty)
    }

    switch (filters.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category))
        break
      case 'difficulty':
        const diffOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 }
        result.sort((a, b) => (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0))
        break
    }

    return result
  }, [filters])

  const clearFilters = () => {
    setFilters({ search: '', category: 'all', difficulty: 'all', sortBy: 'name' })
  }

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.difficulty !== 'all'

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse All Concepts</h1>
          <p className="mt-2 text-muted-foreground">
            {filteredTerms.length} of {allTerms.length} concepts
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search concepts..."
              className="flex h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors w-full sm:w-auto"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as GlossaryFilters['sortBy'] }))}
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors w-full sm:w-auto"
          >
            <option value="name">Sort: Name</option>
            <option value="category">Sort: Category</option>
            <option value="difficulty">Sort: Difficulty</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Results */}
        {filteredTerms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No concepts match your search.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTerms.map((term) => (
              <StaggerItem key={term.id}>
                <Link
                  href={`/terms/${term.slug}`}
                  className="group block"
                >
                  <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge variant="primary" className="text-xs">{term.category}</Badge>
                      <Badge variant={term.difficulty === 'Beginner' ? 'success' : term.difficulty === 'Intermediate' ? 'warning' : 'info'} className="text-xs">
                        {term.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{term.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{term.simpleExplanation}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
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
