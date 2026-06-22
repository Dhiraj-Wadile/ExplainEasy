import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

async function wrappedHandler(req: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  try {
    const resolvedParams = await context.params
    return await handler(req, { params: resolvedParams })
  } catch (error) {
    console.error('[AUTH] NextAuth handler error:', error)
    return Response.json(
      { error: 'Authentication service unavailable' },
      { status: 500 }
    )
  }
}

export const GET = wrappedHandler
export const POST = wrappedHandler
