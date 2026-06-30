'use client'

import { useThemeCtx } from '@/components/shared/app-theme'
import { Sun, Moon } from 'lucide-react'
import { useSyncExternalStore } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeCtx()
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  if (!isClient) return <div className="h-9 w-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
      aria-label="Toggle theme"
    >
      <div
        key={theme}
        className="transition-all duration-250"
        style={{
          opacity: 1,
          transform: 'rotate(0deg) scale(1)',
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </div>
    </button>
  )
}
