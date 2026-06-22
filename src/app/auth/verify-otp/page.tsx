'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lightbulb, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { signIn } from 'next-auth/react'

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const type = searchParams.get('type') || 'VERIFY_EMAIL'

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isPasswordReset = type === 'PASSWORD_RESET'
  const title = isPasswordReset ? 'Reset your password' : 'Verify your email'
  const description = isPasswordReset
    ? 'Enter the 6-digit code sent to your email to reset your password'
    : 'Enter the 6-digit code sent to your email to verify your account'

  useEffect(() => {
    if (!email) router.push('/auth/signin')
  }, [email, router])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const digits = text.replace(/\D/g, '').slice(0, 6).split('')
    const newOtp = Array(6).fill('')
    digits.forEach((d, i) => { newOtp[i] = d })
    setOtp(newOtp)
    const nextIndex = Math.min(digits.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code, type }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed')
        return
      }

      setSuccess(true)

      if (isPasswordReset) {
        setTimeout(() => {
          const params = new URLSearchParams({ email, otp: code })
          router.push(`/auth/reset-password?${params}`)
        }, 1000)
      } else {
        await signIn('credentials', {
          email,
          password: code,
          redirect: false,
        }).catch(() => {})
        setTimeout(() => {
          router.push('/')
        }, 1500)
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResending(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to resend code')
        return
      }

      setOtp(Array(6).fill(''))
      inputRefs.current[0]?.focus()
    } catch {
      setError('Unable to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  if (!email) return null

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B1020]">
        <Card className="p-8 w-full max-w-sm shadow-xl border-primary/10 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Verified!</h2>
          <p className="text-sm text-muted-foreground">
            {isPasswordReset ? 'Redirecting to reset your password...' : 'Your email has been verified. You are being signed in...'}
          </p>
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
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
            <p className="text-xs text-muted-foreground mt-2">{email}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 justify-center mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="w-full h-11 text-base mb-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Verifying...' : 'Verify'}
          </Button>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            <Link href={isPasswordReset ? '/auth/forgot-password' : '/auth/register'} className="hover:underline">
              Use a different email
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
