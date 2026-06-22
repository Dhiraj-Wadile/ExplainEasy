export function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ExplainEasy',
    url: baseUrl,
    description: 'Master business, finance, and entrepreneurship concepts with AI-powered explanations and interactive learning.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
