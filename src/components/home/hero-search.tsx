'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const searchExamples = [
  'What is EBITDA?',
  'What is RAG?',
  'How does UPI work?',
  'What is MVP?',
  'What is Machine Learning?',
]

export function HeroSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [exampleIndex, setExampleIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % searchExamples.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
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
        aria-label="Search concepts"
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
        <span className="absolute left-12 pointer-events-none text-base truncate max-w-[80%] text-muted-foreground">
          {searchExamples[exampleIndex]}
        </span>
      )}
      <kbd className="hidden sm:inline-flex items-center gap-1 mr-3 px-2 py-1 rounded-lg bg-muted/50 border border-border text-[11px] text-muted-foreground shrink-0">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  )
}
