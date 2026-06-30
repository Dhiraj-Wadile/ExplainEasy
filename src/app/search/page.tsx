'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, Clock, X, Globe, Sparkles, ChevronRight, ExternalLink, Loader2 } from 'lucide-react'
import { allTerms } from '@/data'
import { categories } from '@/data/categories'
import { Badge } from '@/components/ui/badge'
import { GlossaryFilters } from '@/types'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper'

interface WebResult {
  title: string
  url: string
  snippet: string
}

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase()
  const q = query.toLowerCase().trim()
  if (t.includes(q)) return true
  const words = q.split(/\s+/)
  if (words.length > 1) return words.every((w) => t.includes(w))
  let qi = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++
  }
  if (qi === q.length) return true
  const qChars = q.split('')
  const tChars = t.split('')
  let matches = 0
  for (const c of qChars) {
    if (tChars.includes(c)) matches++
  }
  return matches / qChars.length >= 0.7
}

function scoreTerm(term: { name: string; definition: string; tags: string[]; category: string; simpleExplanation: string }, query: string): number {
  const q = query.toLowerCase()
  let score = 0
  if (term.name.toLowerCase().includes(q)) score += 100
  else if (fuzzyMatch(term.name, q)) score += 60
  if (term.definition.toLowerCase().includes(q)) score += 30
  else if (fuzzyMatch(term.definition, q)) score += 15
  if (term.simpleExplanation.toLowerCase().includes(q)) score += 20
  else if (fuzzyMatch(term.simpleExplanation, q)) score += 10
  if (term.tags.some((t) => t.toLowerCase().includes(q))) score += 20
  if (term.category.toLowerCase().includes(q)) score += 10
  return score
}

export default function SearchPage() {
  const [filters, setFilters] = useState<GlossaryFilters>({
    search: '',
    category: 'all',
    difficulty: 'all',
    sortBy: 'relevance',
  })
  const [webResults, setWebResults] = useState<WebResult[]>([])
  const [webLoading, setWebLoading] = useState(false)

  const fetchWebResults = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length <= 2) {
      setWebResults([])
      return
    }
    setWebLoading(true)
    try {
      const response = await fetch(`/api/search/web?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setWebResults(data.results || [])
      } else {
        setWebResults([])
      }
    } catch {
      setWebResults([])
    } finally {
      setWebLoading(false)
    }
  }, [])

  const filteredTerms = useMemo(() => {
    let result = [...allTerms]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          fuzzyMatch(t.name, q) ||
          fuzzyMatch(t.definition, q) ||
          fuzzyMatch(t.simpleExplanation, q) ||
          t.tags.some((tag) => fuzzyMatch(tag, q))
      )
      result.sort((a, b) => scoreTerm(b, q) - scoreTerm(a, q))
    }

    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category)
    }

    if (filters.difficulty !== 'all') {
      result = result.filter((t) => t.difficulty === filters.difficulty)
    }

    if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (filters.sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category))
    } else if (filters.sortBy === 'difficulty') {
      const diffOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 }
      result.sort((a, b) => (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0))
    }

    return result
  }, [filters])

  const clearFilters = () => {
    setFilters({ search: '', category: 'all', difficulty: 'all', sortBy: 'relevance' })
  }

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.difficulty !== 'all'

  useEffect(() => {
    if (filters.search.trim().length > 2) {
      const timer = setTimeout(() => fetchWebResults(filters.search), 500)
      return () => clearTimeout(timer)
    }
  }, [filters.search, fetchWebResults])

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse All Concepts</h1>
          <p className="mt-2 text-muted-foreground">
            {filteredTerms.length} of {allTerms.length} concepts
            {filters.search && ` matching "${filters.search}"`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search concepts (fuzzy matching)..."
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
            <option value="relevance">Sort: Relevance</option>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredTerms.length === 0 && !webLoading ? (
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
              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
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
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{term.simpleExplanation || term.definition}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{term.readTime || 3} min read</span>
                        </div>
                        {term.tags && term.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            {term.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>

          {/* Web Results Sidebar */}
          {filters.search.trim().length > 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="w-4 h-4 text-primary" />
                Web Results
                {webLoading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
              </div>
              {webResults.length > 0 ? (
                <div className="space-y-3">
                  {webResults.map((result, i) => (
                    <a
                      key={i}
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all group"
                    >
                      <p className="text-sm font-medium text-primary group-hover:underline line-clamp-1">{result.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-2">
                        <ExternalLink className="w-3 h-3" /> {(() => { try { return new URL(result.url).hostname } catch { return 'link' } })()}
                      </span>
                    </a>
                  ))}
                </div>
              ) : webLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-full mb-1" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No web results found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
