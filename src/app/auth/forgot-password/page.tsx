'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lightbulb, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { forgotPasswordSchema } from '@/lib/validations/auth'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const parsed = forgotPasswordSchema.safeParse({ email })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Request failed')
        return
      }

      router.push(`/auth/verify-otp?email=${encodeURIComponent(parsed.data.email)}&type=PASSWORD_RESET`)
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B1020]">
      <div className="w-full max-w-sm">
        <Card className="p-8 shadow-xl border-primary/10">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Forgot password?</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Enter your email and we&apos;ll send you a code to reset your password
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                autoComplete="email"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-base">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Sending code...' : 'Send Reset Code'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
