'use client'

import { useLanguageStore, type Language, getLanguageLabel } from '@/lib/language'
import { Languages } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const LANGUAGES: Language[] = ['english', 'hinglish', 'hindi', 'marathi']

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="Change language"
      >
        <Languages className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{getLanguageLabel(language)}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-accent ${
                language === lang ? 'text-primary font-medium bg-primary/5' : 'text-foreground'
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
