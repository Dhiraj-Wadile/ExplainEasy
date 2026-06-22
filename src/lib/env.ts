function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`Missing required environment variable: ${key}`)
    }
    return ''
  }
  return value
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  NEXTAUTH_SECRET: requireEnv('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: requireEnv('NEXTAUTH_URL'),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'daily@explaineasy.com',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  CRON_SECRET: process.env.CRON_SECRET || '',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'ExplainEasy',
}
