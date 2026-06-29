'use client'

import Link from 'next/link'
import {
  Brain,
  Cpu,
  ArrowUpRight,
  Sparkles,
  Braces,
  Cloud,
  Workflow,
  LineChart,
  BookOpen,
  ExternalLink,
  Server,
  GitBranch,
  Layers,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const roadmaps = [
  {
    title: 'AI Engineer Roadmap',
    tagline: 'Production AI Systems · RAG · Agents · Monitoring',
    description:
      'Master production-grade AI systems: build and deploy RAG pipelines, create intelligent AI agents, implement LLM observability, and develop the engineering judgment to make the right architectural decisions.',
    href: '/roadmaps/ai-engineer',
    accent: 'from-violet-600 via-purple-500 to-fuchsia-500',
    accentLight: 'from-violet-500 via-purple-400 to-fuchsia-400',
    bgGlow: 'bg-violet-500/10',
    borderGlow: 'group-hover:border-violet-500/40',
    icon: Brain,
    features: [
      { icon: Cpu, text: 'Model serving & GPU optimization' },
      { icon: Workflow, text: 'RAG pipelines & vector databases' },
      { icon: Braces, text: 'AI agents & multi-agent systems' },
      { icon: LineChart, text: 'LLM observability & evaluation' },
    ],
    technologies: [
      'LangChain',
      'LlamaIndex',
      'Pinecone',
      'LangGraph',
      'HuggingFace',
      'Ray',
      'LangSmith',
      'Docker',
      'Kubernetes',
    ],
  },
  {
    title: 'Java Backend + DevOps Roadmap',
    tagline: 'Core DSA · Java Spring Boot · Cloud · System Design',
    description:
      'A structured 7-month plan to master Java backend engineering. Build production-ready APIs with Spring Boot, strengthen core DSA for interviews, and gain DevOps & cloud deployment expertise.',
    href: '/roadmaps/java-backend',
    accent: 'from-sky-500 via-blue-500 to-indigo-600',
    accentLight: 'from-sky-400 via-blue-400 to-indigo-500',
    bgGlow: 'bg-blue-500/10',
    borderGlow: 'group-hover:border-blue-500/40',
    icon: Server,
    features: [
      { icon: Braces, text: 'C++ DSA for interviews' },
      { icon: Layers, text: 'Java + Spring Boot ecosystem' },
      { icon: Cloud, text: 'AWS, Docker, Kubernetes' },
      { icon: GitBranch, text: 'System design & interview prep' },
    ],
    technologies: [
      'Java',
      'Spring Boot',
      'LeetCode',
      'Docker',
      'Kubernetes',
      'AWS',
      'Kafka',
      'Redis',
      'PostgreSQL',
    ],
  },
]

function FloatingOrb({ className }: { className: string }) {
  return (
    <motion.div
      className={cn('absolute rounded-full blur-3xl opacity-20', className)}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -30, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function RoadmapsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <FloatingOrb className="w-[500px] h-[500px] -top-40 -left-40 bg-violet-600/30" />
        <FloatingOrb className="w-[400px] h-[400px] top-1/3 -right-32 bg-blue-600/20" />
        <FloatingOrb className="w-[300px] h-[300px] bottom-20 left-1/4 bg-amber-500/10" />
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-10 md:pt-28 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-white/[0.02] text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Interactive Learning Roadmaps
            </div>
            <h1 className="heading-xl mb-4">
              Your Path to{' '}
              <span className="gradient-text">Mastery</span>
            </h1>
            <p className="body-lg max-w-2xl mx-auto">
              Curated, production-focused roadmaps designed by engineers for engineers.
              Each roadmap is an interactive mind map — explore, zoom, and pan at your own pace.
            </p>
          </motion.div>

          {/* Quick tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/50">
              <ArrowUpRight className="w-3 h-3" /> Zoom with scroll
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/50">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 15l7-7 7 7"/></svg>
              Pan with drag
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/50">
              <BookOpen className="w-3 h-3" /> Click links for resources
            </span>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Cards */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 md:items-stretch">
          {roadmaps.map((roadmap, index) => {
            const Icon = roadmap.icon
            return (
              <motion.div
                key={roadmap.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 * (index + 1) }}
              >
                <Link
                  href={roadmap.href}
                  className={cn(
                    'group relative flex flex-col h-full rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm',
                    'transition-all duration-500 ease-out',
                    'hover:border-border/80 hover:bg-card/80 hover:shadow-2xl',
                    roadmap.borderGlow
                  )}
                >
                  {/* Gradient accent bar */}
                  <div
                    className={cn(
                      'absolute top-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r opacity-60',
                      'transition-all duration-500 group-hover:opacity-100 group-hover:h-1.5',
                      roadmap.accent
                    )}
                  />

                  {/* Glow on hover */}
                  <div
                    className={cn(
                      'absolute -inset-px rounded-2xl opacity-0 blur-xl transition-opacity duration-500',
                      roadmap.bgGlow,
                      'group-hover:opacity-100'
                    )}
                  />

                  <div className="relative z-10 flex flex-col h-full p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', roadmap.accent)}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300',
                        'bg-white/[0.04] text-muted-foreground group-hover:bg-white/[0.08] group-hover:text-foreground'
                      )}>
                        Explore <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h2 className="text-xl font-bold text-foreground mb-1.5">{roadmap.title}</h2>
                    <p className="text-sm text-muted-foreground mb-5">{roadmap.tagline}</p>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed mb-6">{roadmap.description}</p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {roadmap.features.map((f) => (
                        <div key={f.text} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-border/40">
                          <f.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-xs text-muted-foreground">{f.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="mt-auto">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {roadmap.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={cn(
                              'px-2.5 py-1 rounded-md text-[11px] font-medium',
                              'bg-white/[0.04] text-muted-foreground border border-border/40',
                              'transition-all duration-300',
                              index === 0
                                ? 'group-hover:bg-violet-500/10 group-hover:text-violet-300 group-hover:border-violet-500/20'
                                : 'group-hover:bg-sky-500/10 group-hover:text-sky-300 group-hover:border-sky-500/20'
                            )}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="p-8 rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm"
          >
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">More roadmaps coming soon</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We&apos;re building roadmaps for Data Engineering, MLOps, Frontend, and more.
              Each roadmap is designed to be your north star — practical, focused, and production-first.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
