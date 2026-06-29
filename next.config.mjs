/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 60 * 60 * 24,
  },

  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },

  serverExternalPackages: ['@upstash/redis'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'X-RateLimit-Limit', value: '60' },
        ],
      },
    ]
  },

  poweredByHeader: false,
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/roadmaps/:slug',
        destination: '/roadmaps/:slug/index.html',
      },
    ]
  },
}

export default nextConfig
