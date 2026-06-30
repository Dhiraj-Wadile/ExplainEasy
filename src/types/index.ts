export interface Concept {
  id: string
  slug: string
  name: string
  category: string
  subcategory?: string
  definition: string
  simpleExplanation: string
  example: string
  whyItMatters: string
  formula?: string
  formulaDescription?: string
  relatedTerms: string[]
  interviewQuestions: string[]
  commonMistakes?: string[]
  sharkTankExample?: string
  realCompanyExample?: string
  visualDiagram?: string
  quickSummary?: string
  faqs: { question: string; answer: string }[]
  references: string[]
  tags: string[]
  icon: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  featured?: boolean
  popular?: boolean
  createdAt: string
  readTime?: number
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  gradient?: string
  termCount: number
  featured?: boolean
}

export interface BusinessQuote {
  id: string
  text: string
  author: string
  role: string
  company: string
}

export interface SuccessStory {
  id: string
  title: string
  company: string
  founder: string
  description: string
  learnings: string[]
  icon: string
}

export interface Flashcard {
  id: string
  conceptSlug: string
  question: string
  answer: string
}

export interface QuizQuestion {
  id: string
  conceptSlug: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface DailyConcept {
  concept: Concept
  date: string
}

export interface GlossaryFilters {
  search: string
  category: string
  difficulty: string
  sortBy: 'relevance' | 'name' | 'category' | 'difficulty'
}
