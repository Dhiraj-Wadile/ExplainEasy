import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function proxy(req) {
    const pathname = req.nextUrl.pathname
    const token = req.nextauth.token

    if (pathname.startsWith('/api/cron')) {
      const cronSecret = req.headers.get('x-cron-secret')
      if (cronSecret !== process.env.CRON_SECRET) {
        console.warn('[PROXY] Unauthorized cron attempt')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.next()
    }

    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin?callbackUrl=/admin', req.url))
      }
      if (pathname === '/admin/dashboard') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname

        // Always allow auth pages, api/auth, static files
        if (
          pathname.startsWith('/_next') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/search') ||
          pathname.startsWith('/api/newsletter') ||
          pathname.startsWith('/api/ai') ||
          pathname.startsWith('/api/chat') ||
          pathname === '/' ||
          pathname.startsWith('/categories') ||
          pathname.startsWith('/terms') ||
          pathname.startsWith('/search') ||
          pathname.startsWith('/about') ||
          pathname.startsWith('/resources') ||
          pathname.startsWith('/videos') ||
          pathname.startsWith('/learn') ||
          pathname.startsWith('/social') ||
          pathname.startsWith('/auth') ||
          pathname.startsWith('/api/auth')
        ) {
          return true
        }

        // /admin requires a token (role check in middleware fn)
        if (pathname.startsWith('/admin')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/admin', '/api/cron/:path*'],
}
