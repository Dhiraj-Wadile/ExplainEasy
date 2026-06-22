'use client'

import Link from 'next/link'
import { Heart, BookOpen, CheckCircle, Brain, Building2, TrendingUp, Rocket, Target, Zap, ArrowLeft } from 'lucide-react'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <FadeInUp>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About ExplainEasy</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Our mission is simple: make complex concepts easy to understand. We believe that 
            knowledge should be accessible to everyone, regardless of their background.
          </p>
        </FadeInUp>

        <div className="mt-16 space-y-16">
          <FadeInUp>
            <Section title="Our Mission">
              <p className="text-muted-foreground leading-relaxed">
                ExplainEasy was created to bridge the gap between complex business, technology, and 
                academic concepts and the people who want to learn them. We break down intimidating 
                topics into simple, digestible explanations with real-world examples.
              </p>
            </Section>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <Section title="What We Cover">
              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Brain, title: 'AI & Technology', desc: 'LLMs, Machine Learning, APIs, Cloud' },
                  { icon: Building2, title: 'Business', desc: 'Revenue, Profit, Strategy, Models' },
                  { icon: TrendingUp, title: 'Finance', desc: 'Valuation, Investment, Metrics' },
                  { icon: Rocket, title: 'Startups', desc: 'Funding, Growth, Product-Market Fit' },
                  { icon: Target, title: 'Marketing & Sales', desc: 'Funnels, SEO, CRM, Branding' },
                  { icon: Zap, title: 'How Things Work', desc: 'UPI, ChatGPT, Netflix, Amazon' },
                ].map((item) => (
                  <StaggerItem key={item.title}>
                    <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                      <item.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Section>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <Section title="Our Values">
              <div className="space-y-4">
                {[
                  { icon: Heart, title: 'Simplicity First', desc: 'Every concept is explained in plain language.' },
                  { icon: CheckCircle, title: 'Real-World Focus', desc: 'Every explanation includes practical examples.' },
                  { icon: BookOpen, title: 'Free & Accessible', desc: 'Knowledge should be free for everyone.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </FadeInUp>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {children}
    </section>
  )
}
