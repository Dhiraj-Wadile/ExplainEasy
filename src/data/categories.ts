import { Category } from '@/types'

export const categories: Category[] = [
  { id: '1', slug: 'ai-explained', name: 'AI Explained', description: 'Learn about Artificial Intelligence, LLMs, Machine Learning, and cutting-edge AI concepts in simple terms', icon: 'Brain', color: 'violet', featured: true, termCount: 24 },
  { id: '2', slug: 'tech-explained', name: 'Tech Explained', description: 'Understand how modern technology works - APIs, Docker, Cloud Computing, and more', icon: 'Cpu', color: 'cyan', featured: true, termCount: 20 },
  { id: '3', slug: 'business-basics', name: 'Business Basics', description: 'Foundation concepts for understanding how businesses operate and succeed', icon: 'Building2', color: 'blue', featured: true, termCount: 56 },
  { id: '4', slug: 'finance', name: 'Finance', description: 'Key financial concepts, metrics, and principles explained simply', icon: 'TrendingUp', color: 'emerald', featured: true, termCount: 46 },
  { id: '5', slug: 'startup', name: 'Startup', description: 'Essential concepts for launching and growing a successful startup', icon: 'Rocket', color: 'purple', featured: true, termCount: 45 },
  { id: '6', slug: 'marketing', name: 'Marketing', description: 'Strategies, channels, and metrics for reaching and engaging customers', icon: 'Megaphone', color: 'orange', featured: true, termCount: 49 },
  { id: '7', slug: 'sales', name: 'Sales', description: 'Techniques, methodologies, and metrics for driving revenue', icon: 'Handshake', color: 'green', featured: true, termCount: 45 },
  { id: '8', slug: 'product-management', name: 'Product Management', description: 'Frameworks and practices for building and managing successful products', icon: 'Layers', color: 'indigo', featured: true, termCount: 40 },
  { id: '9', slug: 'entrepreneurship', name: 'Entrepreneurship', description: 'Mindset, skills, and strategies for entrepreneurial success', icon: 'Briefcase', color: 'amber', featured: true, termCount: 47 },
  { id: '10', slug: 'shark-tank', name: 'Shark Tank', description: 'Understand every Concept from Shark Tank - equity, valuation, royalties, and deals', icon: 'Shark', color: 'sky', featured: true, termCount: 45 },
  { id: '11', slug: 'business-models', name: 'Business Models', description: 'Different ways businesses create, deliver, and capture value', icon: 'CircleDot', color: 'teal', featured: true, termCount: 39 },
  { id: '12', slug: 'how-things-work', name: 'How Things Work', description: 'Understand how everyday technology and systems work behind the scenes', icon: 'Zap', color: 'yellow', featured: true, termCount: 10 },
  { id: '13', slug: 'case-studies', name: 'Case Studies', description: 'Deep dives into successful companies and the strategies behind their growth', icon: 'BookOpen', color: 'rose', featured: true, termCount: 14 },
  { id: '14', slug: 'negotiation', name: 'Negotiation', description: 'Strategies and tactics for reaching mutually beneficial agreements', icon: 'MessageCircle', color: 'pink', featured: false, termCount: 30 },
  { id: '15', slug: 'investment', name: 'Investment', description: 'Concepts and instruments for investing and building wealth', icon: 'DollarSign', color: 'red', featured: false, termCount: 36 },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}

export function getFeaturedCategories(): Category[] {
  return categories.filter((c) => c.featured)
}

export const CATEGORY_NAMES: Record<string, string> =
  Object.fromEntries(categories.map((c) => [c.slug, c.name]))
