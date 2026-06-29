'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { categories } from '@/data/categories'
import { getIcon } from '@/lib/icons'
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/motion'

const categoryInterests = categories.map((c) => ({
  slug: c.slug,
  name: c.name,
  icon: c.icon,
  description: c.description,
}))

export default function OnboardingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function toggleInterest(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  async function handleSave() {
    if (selected.length === 0) return
    setSaving(true)
    try {
      await fetch('/api/onboarding/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: selected }),
      })
      router.push('/dashboard')
    } catch {
      router.push('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  function handleSkip() {
    router.push('/')
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  return (
    <main className="min-h-screen section-padding">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <FadeInUp>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Personalize Your Experience
          </div>
          <h1 className="heading-md mb-3">What interests you?</h1>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Select topics you want to learn about. We&apos;ll create a personalized learning path for you.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {categoryInterests.map((cat) => {
              const IconComp = getIcon(cat.icon)
              const isSelected = selected.includes(cat.slug)
              return (
                <StaggerItem key={cat.slug}>
                  <button
                    onClick={() => toggleInterest(cat.slug)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/30 hover:bg-accent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{cat.description}</p>
                  </button>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleSave}
              disabled={selected.length === 0 || saving}
              size="lg"
              className="px-8"
            >
              {saving ? 'Saving...' : `Start Learning (${selected.length} selected)`}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        </FadeInUp>
      </div>
    </main>
  )
}
