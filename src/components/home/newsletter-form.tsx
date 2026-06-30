'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Subscribed successfully!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-4 animate-fade-in">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        <p className="font-medium text-emerald-400">{message}</p>
        <p className="text-xs text-muted-foreground">Free forever. No spam. Unsubscribe anytime.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
          placeholder="Enter your email"
          aria-label="Email for newsletter"
          className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 transition-colors"
        />
        <Button type="submit" disabled={status === 'loading'} className="h-11 gap-2">
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      {status === 'error' && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-red-500 mt-3 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5" />
          {message}
        </p>
      )}
      {status === 'idle' && (
        <p className="text-xs text-muted-foreground mt-3">Free forever. No spam. Unsubscribe anytime.</p>
      )}
    </form>
  )
}
