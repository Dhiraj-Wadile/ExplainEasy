'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lightbulb, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { resetPasswordSchema } from '@/lib/validations/auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const otp = searchParams.get('otp') || ''

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const parsed = resetPasswordSchema.safeParse({ email, otp, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/auth/signin'), 2000)
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B1020]">
        <Card className="p-8 w-full max-w-sm shadow-xl border-primary/10 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Password reset!</h2>
          <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B1020]">
      <div className="w-full max-w-sm">
        <Card className="p-8 shadow-xl border-primary/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Set new password</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Choose a strong password for your account
            </p>
            <p className="text-xs text-muted-foreground mt-2">{email}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Must be at least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-base">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            <Link href="/auth/signin" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
