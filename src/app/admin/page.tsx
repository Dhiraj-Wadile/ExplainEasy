'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const stats = [
  { label: 'Total Concepts', value: '524', change: '+12%', icon: BookOpen },
  { label: 'Active Users', value: '1,234', change: '+8%', icon: Users },
  { label: 'Page Views', value: '45.2K', change: '+23%', icon: Eye },
  { label: 'Avg. Session', value: '4m 32s', change: '+5%', icon: TrendingUp },
]

const recentActivity = [
  { action: 'New concept added', item: 'Venture Capital', user: 'Admin', time: '2 min ago' },
  { action: 'Video uploaded', item: 'Unit Economics Explained', user: 'Admin', time: '15 min ago' },
  { action: 'User registered', item: 'john@example.com', user: 'New User', time: '1 hour ago' },
  { action: 'Concept updated', item: 'Bootstrapping', user: 'Admin', time: '2 hours ago' },
  { action: 'Quiz completed', item: 'Finance Fundamentals (85%)', user: 'sarah@example.com', time: '3 hours ago' },
]

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: BookOpen, label: 'Concepts', count: 524 },
  { icon: Users, label: 'Users', count: 1234 },
  { icon: Video, label: 'Videos', count: 45 },
  { icon: FileText, label: 'Content' },
  { icon: MessageCircle, label: 'Comments' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Star, label: 'Achievements' },
  { icon: Settings, label: 'Settings' },
]

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-full bg-card border-r border-border z-30 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-0 -translate-x-full'}`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">Admin Panel</span>
            </div>
          </div>
          <nav className="p-2 space-y-1">
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
                {item.count && (
                  <Badge variant="default" className="ml-auto text-xs px-1.5 py-0">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
          <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <h1 className="font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-muted text-sm outline-none w-48 focus:w-64 transition-all border border-border"
                />
              </div>
              <Button className="gap-2 text-sm">
                <Plus className="w-4 h-4" /> New Concept
              </Button>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs text-emerald-500">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.item}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: BookOpen, label: 'Add Concept' },
                    { icon: Video, label: 'Upload Video' },
                    { icon: Users, label: 'Manage Users' },
                    { icon: Star, label: 'Set Daily Pick' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <action.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
