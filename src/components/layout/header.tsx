'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Lightbulb, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

function NavLink({ href, label, pathname, onClick }: { href: string; label: string; pathname: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        pathname === href
          ? 'text-foreground bg-white/5'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
      )}
    >
      {label}
    </Link>
  )
}

const sharedLinks = [
  { label: 'Categories', href: '/categories' },
  { label: 'Videos', href: '/videos' },
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'Resources', href: '/resources' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => { setMounted(true) }, [])

  const navLinks = mounted
    ? [...sharedLinks, { label: 'Dashboard', href: '/dashboard' }]
    : sharedLinks

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              explain<span className="text-primary">easy</span>
            </span>
          </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} pathname={pathname} />
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {session ? (
            <Link
              href="/dashboard"
              title="Dashboard"
              className="ml-1.5 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {session.user?.name?.[0] || 'A'}
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden sm:inline-flex items-center gap-1.5 ml-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors -mr-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="px-3 py-2 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => { setMobileOpen(false); setMounted(true) }}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-foreground bg-white/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-border">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
                        {session.user?.name?.[0] || 'A'}
                      </div>
                      Dashboard
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      Admin
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
