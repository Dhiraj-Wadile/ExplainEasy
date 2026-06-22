import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname
    const token = req.nextauth.token

    if (pathname.startsWith('/api/cron')) {
      const cronSecret = req.headers.get('x-cron-secret')
      if (cronSecret !== process.env.CRON_SECRET) {
        console.warn('[MIDDLEWARE] Unauthorized cron attempt')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.next()
    }

    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin?callbackUrl=/admin', req.url))
      }
      if (token.role !== 'ADMIN' && token.role !== 'EDITOR') {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
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
  matcher: ['/admin/:path*', '/api/cron/:path*'],
}
