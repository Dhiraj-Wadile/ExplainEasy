'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Lightbulb, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PremiumModal() {
  const { status } = useSession()
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const restrictedPaths = [
    '/terms/', '/search', '/videos', '/learn',
    '/categories/', '/resources', '/admin',
  ]
  const isRestricted = restrictedPaths.some((p) =>
    typeof window !== 'undefined' && window.location.pathname.startsWith(p)
  )

  useEffect(() => {
    if (status !== 'unauthenticated' || dismissed || !isRestricted) return

    timerRef.current = setTimeout(() => {
      setShow(true)
    }, 60_000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [status, dismissed, isRestricted])

  const modalVisible = show && status !== 'authenticated'

  const handleOAuth = useCallback(async (provider: string) => {
    setOauthLoading(provider)
    try {
      await signIn(provider, { callbackUrl: window.location.pathname })
    } catch {
      setOauthLoading(null)
    }
  }, [])

  const benefits = [
    '500+ Concepts Explained',
    'Daily Learning Reminders',
    'AI-Powered Search',
    'Personalized Dashboard',
    'Bookmarks & Notes',
  ]

  return (
    <AnimatePresence>
      {modalVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => { setShow(false); setDismissed(true) }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md bg-card border border-primary/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-8">
                <button
                  onClick={() => { setShow(false); setDismissed(true) }}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Welcome to ExplainEasy</h2>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Sign in to unlock all features
                  </p>
                </div>

                <div className="space-y-2.5 mb-6">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full gap-3 h-11"
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuth('google')}
                  >
                    {oauthLoading === 'google' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    )}
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-3 h-11"
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuth('github')}
                  >
                    {oauthLoading === 'github' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    )}
                    Continue with GitHub
                  </Button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full h-11 text-base"
                    onClick={() => { setShow(false); router.push('/auth/register') }}
                  >
                    Sign Up with Email
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full h-11 text-sm text-muted-foreground"
                    onClick={() => { setShow(false); router.push('/auth/signin') }}
                  >
                    Already have an account? Sign in
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
