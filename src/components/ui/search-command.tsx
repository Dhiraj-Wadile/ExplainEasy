'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Command, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { allTerms } from '@/data/index'

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allTerms
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [query])

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false)
      setQuery('')
      router.push(`/terms/${slug}`)
    },
    [router]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].slug)
      }
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground w-56 border border-border"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search concepts...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background border border-border text-xs text-muted-foreground">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.12 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search any concept..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                  />
                  {query && (
                    <button onClick={() => setQuery('')}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {results.length > 0 ? (
                    <div>
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Results
                      </div>
                      {results.map((term, i) => (
                        <button
                          key={term.slug}
                          onClick={() => handleSelect(term.slug)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                            i === selectedIndex
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {term.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {term.definition}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {term.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No results found for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                      Type to search business concepts
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">esc</kbd> Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
