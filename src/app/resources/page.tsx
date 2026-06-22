'use client'

import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'
import { FadeInUp } from '@/components/shared/motion-wrapper'

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <FadeInUp>
          <Construction className="w-16 h-16 mx-auto mb-6 text-primary/40" />
          <h1 className="text-3xl font-bold tracking-tight mb-3">Resources</h1>
          <p className="text-muted-foreground mb-8">
            Downloadable guides, templates, and tools are coming soon.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </FadeInUp>
      </div>
    </div>
  )
}
