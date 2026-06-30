import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppThemeProvider } from '@/components/shared/app-theme'
import { QueryProvider } from '@/components/shared/query-provider'
import { SessionProvider } from '@/components/shared/session-provider'
import { AuthProvider } from '@/components/auth/auth-context'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { JsonLd } from '@/components/shared/json-ld'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ChatBotLoader, PremiumModalLoader } from '@/components/dynamic-loaders'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ExplainEasy - Business Concepts, Explained Simply',
    template: '%s | ExplainEasy',
  },
  description:
    'Master business, finance, and entrepreneurship concepts with AI-powered explanations, interactive learning, and daily insights.',
  keywords: [
    'business concepts',
    'finance explained',
    'entrepreneurship',
    'AI learning',
    'business education',
    'marketing terms',
    'startup glossary',
  ],
  authors: [{ name: 'ExplainEasy' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ExplainEasy',
    title: 'ExplainEasy - Business Concepts, Explained Simply',
    description:
      'Master business, finance, and entrepreneurship concepts with AI-powered explanations and interactive learning.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExplainEasy - Business Concepts, Explained Simply',
    description:
      'Master business, finance, and entrepreneurship concepts with AI-powered explanations and interactive learning.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" suppressHydrationWarning={true}>
      <head>
        <JsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches));document.documentElement.style.colorScheme=document.documentElement.classList.contains('dark')?'dark':'light'}catch(e){}})()`
        }} />
        <AppThemeProvider>
          <SessionProvider>
            <AuthProvider>
              <QueryProvider>
                <ErrorBoundary>
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <div className="flex-1">{children}</div>
                    <Footer />
                  </div>
                  <ChatBotLoader />
                  <PremiumModalLoader />
                </ErrorBoundary>
              </QueryProvider>
            </AuthProvider>
          </SessionProvider>
          </AppThemeProvider>
        </body>
      </html>
  )
}
