'use client'

import { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const original = console.error.bind(console)
    console.error = (...args) => {
      const msg = typeof args[0] === 'string' ? args[0] : ''
      if (msg.includes('Encountered a script tag while rendering React component')) return
      original(...args)
    }
    return () => { console.error = original }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
