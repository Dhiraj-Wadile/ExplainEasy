'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lightbulb, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { signupSchema } from '@/lib/validations/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const parsed = signupSchema.safeParse({ name, email, password, confirmPassword })
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string
        if (!errs[field]) errs[field] = issue.message
      }
      setFieldErrors(errs)
      setError(parsed.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.')
        return
      }

      router.push(`/auth/verify-otp?email=${encodeURIComponent(parsed.data.email)}&type=VERIFY_EMAIL`)
    } catch {
      setError('Unable to connect. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B1020]">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl border-primary/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Start learning in minutes</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={`w-full h-11 px-4 rounded-xl border ${fieldErrors.name ? 'border-red-500/50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all`}
                autoComplete="name"
              />
              {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
            </div>

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
                className={`w-full h-11 px-4 rounded-xl border ${fieldErrors.email ? 'border-red-500/50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all`}
                autoComplete="email"
              />
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={`w-full h-11 px-4 pr-10 rounded-xl border ${fieldErrors.password ? 'border-red-500/50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all`}
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
              {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength ? 'bg-emerald-500' : password.length >= 8 ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className={`text-xs ${passwordStrength ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {passwordStrength ? 'Strong' : password.length >= 8 ? 'Fair' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full h-11 px-4 pr-10 rounded-xl border ${fieldErrors.confirmPassword ? 'border-red-500/50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{fieldErrors.confirmPassword}</p>}
              {confirmPassword && password === confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-base">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">Already have an account?</span>
            </div>
          </div>

          <p className="text-sm text-center">
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
