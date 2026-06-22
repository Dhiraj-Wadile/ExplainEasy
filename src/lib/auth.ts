import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

function getEnvOrThrow(key: string, label: string): string {
  const val = process.env[key]
  if (!val) {
    console.error(`[AUTH] Missing ${key} (${label})`)
    throw new Error(`Server configuration error: ${label} is not configured`)
  }
  return val
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user.email) return false
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        })
        if (existingUser) {
          const isLinked = existingUser.accounts.some(
            (a) => a.provider === account.provider && a.providerAccountId === account.providerAccountId
          )
          if (isLinked) return true
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          })
          return true
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'USER'
        token.id = user.id
      }
      if (account && user?.email) {
        const adminEmail = process.env.ADMIN_EMAIL
        const role = user.email === adminEmail ? 'ADMIN' as const : 'USER' as const
        token.role = role
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { role },
          })
        } catch (err) {
          console.error('[AUTH] Failed to update role after OAuth:', err)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = (token.role as string) || 'USER'
      }
      return session
    },
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: getEnvOrThrow('GOOGLE_CLIENT_ID', 'Google OAuth Client ID'),
            clientSecret: getEnvOrThrow('GOOGLE_CLIENT_SECRET', 'Google OAuth Client Secret'),
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: getEnvOrThrow('GITHUB_CLIENT_ID', 'GitHub OAuth Client ID'),
            clientSecret: getEnvOrThrow('GITHUB_CLIENT_SECRET', 'GitHub OAuth Client Secret'),
          }),
        ]
      : []),
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user) {
          throw new Error('No account found with this email')
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in')
        }

        if (!user.passwordHash) {
          throw new Error('This account uses Google/GitHub sign-in. Please use that method instead.')
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
}
