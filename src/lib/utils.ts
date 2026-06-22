import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getGradientByCategory(category: string): string {
  const gradients: Record<string, string> = {
    'Business Basics': 'from-blue-600 to-cyan-500',
    Finance: 'from-emerald-600 to-teal-500',
    Startup: 'from-purple-600 to-pink-500',
    Marketing: 'from-orange-600 to-rose-500',
    Sales: 'from-green-600 to-lime-500',
    'Product Management': 'from-indigo-600 to-violet-500',
    Entrepreneurship: 'from-amber-600 to-yellow-500',
    Investment: 'from-red-600 to-pink-500',
    'Shark Tank': 'from-sky-600 to-blue-500',
    'Business Models': 'from-teal-600 to-emerald-500',
    Negotiation: 'from-rose-600 to-red-500',
  }
  return gradients[category] || 'from-gray-600 to-slate-500'
}


