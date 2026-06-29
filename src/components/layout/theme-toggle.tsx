'use client'

import { useThemeCtx } from '@/components/shared/app-theme'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
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
      <motion.div
        key={theme}
        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </button>
  )
}
