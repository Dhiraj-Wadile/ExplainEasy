'use client'

import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RestrictedContentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  showLock?: boolean
}

export function RestrictedContent({
  children,
  fallback,
  showLock = true,
}: RestrictedContentProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted/20 rounded-xl h-48" />
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex flex-col items-center justify-center p-8 text-center">
        {showLock && (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-primary" />
          </div>
        )}
        <h3 className="font-semibold mb-1">Sign in to access</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          Create a free account to unlock bookmarks, notes, AI search, and more.
        </p>
        <div className="flex gap-3">
          <Button size="sm" onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push('/auth/register')}>
            Sign Up
          </Button>
        </div>
      </div>
      <div className="pointer-events-none select-none opacity-30">
        {children}
      </div>
    </motion.div>
  )
}
