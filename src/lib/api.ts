export async function searchConcepts(query: string) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function generateWithAI(prompt: string, type?: string) {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, type }),
  })
  if (!res.ok) throw new Error('AI generation failed')
  return res.json()
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Subscription failed')
  return res.json()
}
