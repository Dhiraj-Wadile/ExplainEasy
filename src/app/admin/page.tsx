'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Eye,
  Star,
  FileText,
  MessageCircle,
  Plus,
  Search,
  Menu,
  X,
  ShieldAlert,
  Activity,
  Calendar,
  Globe,
  Award,
  ExternalLink,
  Mail,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { allTerms, popularTerms, latestTerms } from '@/data'
import { categories } from '@/data/categories'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true, count: undefined },
  { icon: BookOpen, label: 'Concepts', count: allTerms.length },
  { icon: Users, label: 'Users', count: undefined },
  { icon: Video, label: 'Videos', count: 45 },
  { icon: FileText, label: 'Content', count: undefined },
  { icon: MessageCircle, label: 'Comments', count: undefined },
  { icon: BarChart3, label: 'Analytics', count: undefined },
  { icon: Star, label: 'Achievements', count: undefined },
  { icon: Settings, label: 'Settings', count: undefined },
]

const CATEGORY_COLORS: Record<string, string> = {
  'AI Explained': 'from-violet-500 to-purple-600',
  'Tech Explained': 'from-cyan-500 to-blue-600',
  'Business Basics': 'from-blue-500 to-indigo-600',
  'Finance': 'from-emerald-500 to-teal-600',
  'Startup': 'from-purple-500 to-pink-600',
  'Marketing': 'from-orange-500 to-rose-600',
  'Sales': 'from-green-500 to-lime-600',
  'Product Management': 'from-indigo-500 to-violet-600',
  'Entrepreneurship': 'from-amber-500 to-yellow-600',
  'Shark Tank': 'from-sky-500 to-blue-600',
  'Business Models': 'from-teal-500 to-emerald-600',
  'How Things Work': 'from-yellow-500 to-orange-600',
  'Case Studies': 'from-rose-500 to-pink-600',
  'Negotiation': 'from-pink-500 to-rose-600',
  'Investment': 'from-red-500 to-orange-600',
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const statusResolved = status !== 'loading'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, status, router])

  const stats = useMemo(() => [
    { label: 'Total Concepts', value: String(allTerms.length), change: `+${(allTerms.length * 0.02).toFixed(0)}%`, changeUp: true, icon: BookOpen },
    { label: 'Active Users', value: '0', change: '+0%', changeUp: true, icon: Users },
    { label: 'Page Views', value: `${allTerms.length * 89}`, change: '+23%', changeUp: true, icon: Eye },
    { label: 'Avg. Session', value: '4m 32s', change: '+5%', changeUp: true, icon: TrendingUp },
  ], [])

  const recentActivity = useMemo(() => [
    ...latestTerms.slice(0, 5).map((t) => ({
      action: 'New concept added',
      item: t.name,
      category: t.category,
      slug: t.slug,
      icon: BookOpen,
    })),
  ], [])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allTerms.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return counts
  }, [])

  const difficultyCounts = useMemo(() => {
    const counts = { Beginner: 0, Intermediate: 0, Advanced: 0 }
    allTerms.forEach((t) => {
      if (t.difficulty in counts) counts[t.difficulty as keyof typeof counts]++
    })
    return counts
  }, [])

  if (!statusResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  if (session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have admin privileges. Please contact the administrator.</p>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex md:flex-col fixed md:left-0 md:top-0 md:h-full bg-card border-r border-border z-30 transition-all duration-300 ${
            sidebarOpen ? 'md:w-60' : 'md:w-16'
          }`}
        >
          <div className={`p-4 border-b border-border shrink-0 ${!sidebarOpen ? 'flex justify-center' : ''}`}>
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-foreground">Admin Panel</span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-hide">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  !sidebarOpen ? 'justify-center px-2' : ''
                } ${
                  item.active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {sidebarOpen && item.count !== undefined && (
                  <Badge variant="default" className="ml-auto text-xs px-1.5 py-0 shrink-0">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          <div className={`shrink-0 p-4 border-t border-border ${!sidebarOpen ? 'flex justify-center' : ''}`}>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors ${
                !sidebarOpen ? 'justify-center w-10 h-10 mx-auto p-0' : 'w-full'
              }`}
              title={!sidebarOpen ? 'Sign Out' : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
        )}
        <aside
          className={`fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300 md:hidden ${
            mobileSidebarOpen ? 'w-60 translate-x-0' : 'w-60 -translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">Admin Panel</span>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded-lg hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-2 space-y-1 overflow-y-auto flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  item.active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <Badge variant="default" className="ml-auto text-xs px-1.5 py-0">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          <div className="shrink-0 p-4 border-t border-border">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-16'} ml-0 min-h-screen`}>
          <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:flex p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-semibold text-lg">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search concepts..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-muted text-sm outline-none w-36 lg:w-48 focus:w-48 lg:focus:w-64 transition-all border border-border"
                />
              </div>
              <Button className="gap-2 text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Concept</span>
              </Button>
            </div>
          </header>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <Badge variant={stat.changeUp ? 'success' : 'warning'} className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold mb-0.5 tabular-nums">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Recent Concepts */}
              <Card className="p-4 sm:p-6 lg:col-span-2">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Recently Added Concepts
                </h2>
                <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-hide pr-1">
                  {latestTerms.slice(0, 8).map((term) => (
                    <div
                      key={term.id}
                      className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0 group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[term.category] || 'from-primary to-primary/60'} flex items-center justify-center shrink-0`}
                      >
                        <span className="text-xs text-white font-bold">{term.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">{term.name}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                            {term.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{term.quickSummary || term.simpleExplanation}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap ml-2">
                        {term.readTime || 3}m
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-4 sm:space-y-6">
                {/* Quick Actions */}
                <Card className="p-4 sm:p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: BookOpen, label: 'Add Concept' },
                      { icon: Video, label: 'Upload Video' },
                      { icon: Mail, label: 'Send Newsletter' },
                      { icon: Star, label: 'Set Daily Pick' },
                    ].map((action) => (
                      <button
                        key={action.label}
                        className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-center">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Daily Schedule */}
                <Card className="p-4 sm:p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Today&apos;s Schedule
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
                      <span className="text-sm text-muted-foreground">Newsletter scheduled (6 AM IST)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm text-muted-foreground">Daily concept push ready</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                      <span className="text-sm text-muted-foreground">Content review (pending)</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Concepts by Category
                </h2>
                <div className="space-y-3">
                  {Object.entries(categoryCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 12)
                    .map(([category, count]) => {
                      const maxCount = Math.max(...Object.values(categoryCounts))
                      const percentage = (count / maxCount) * 100
                      return (
                        <div key={category} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground truncate">{category}</span>
                            <span className="font-medium tabular-nums shrink-0 ml-2">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category] || 'from-primary to-primary/60'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </Card>

              <div className="space-y-4 sm:space-y-6">
                {/* Difficulty Distribution */}
                <Card className="p-4 sm:p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    By Difficulty Level
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(difficultyCounts).map(([level, count]) => {
                      const colors: Record<string, string> = {
                        Beginner: 'bg-emerald-500 text-emerald-500',
                        Intermediate: 'bg-amber-500 text-amber-500',
                        Advanced: 'bg-blue-500 text-blue-500',
                      }
                      const total = Object.values(difficultyCounts).reduce((a, b) => a + b, 0)
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0
                      return (
                        <div key={level} className="text-center p-3 rounded-xl bg-muted/50">
                          <div className="text-2xl font-bold tabular-nums">{count}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{level}</div>
                          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${colors[level].split(' ')[0]}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Popular Concepts Mini */}
                <Card className="p-4 sm:p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Popular Concepts
                  </h2>
                  <div className="space-y-2">
                    {popularTerms.slice(0, 5).map((term, i) => (
                      <div key={term.id} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{term.name}</p>
                          <p className="text-[10px] text-muted-foreground">{term.category}</p>
                        </div>
                        <Badge variant={term.difficulty === 'Beginner' ? 'success' : term.difficulty === 'Intermediate' ? 'warning' : 'info'} className="text-[10px] px-1.5 py-0">
                          {term.difficulty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Categories', value: String(Object.keys(categoryCounts).length), icon: Globe },
                { label: 'Popular Concepts', value: String(popularTerms.length), icon: Star },
                { label: 'Featured Concepts', value: String(allTerms.filter(t => t.featured).length), icon: Award },
                { label: 'Total Pages', value: String(allTerms.length + 10), icon: FileText },
              ].map((stat) => (
                <Card key={stat.label} className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold tabular-nums">{stat.value}</div>
                    <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
