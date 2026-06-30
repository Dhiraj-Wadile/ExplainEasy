import { Concept } from '@/types'
import { businessBasicsTerms } from './terms/business-basics'
import { financeTerms } from './terms/finance'
import { startupTerms } from './terms/startup'
import { marketingTerms } from './terms/marketing'
import { salesTerms } from './terms/sales'
import { productManagementTerms } from './terms/product-management'
import { entrepreneurshipTerms } from './terms/entrepreneurship'
import { investmentTerms } from './terms/investment'
import { sharkTankTerms } from './terms/shark-tank'
import { businessModelsTerms } from './terms/business-models'
import { negotiationTerms } from './terms/negotiation'
import { aiTerms } from './terms/ai'
import { techTerms } from './terms/technology'
import { howThingsWorkTerms } from './terms/how-things-work'
import { caseStudyTerms } from './terms/case-studies'
import { newConcepts } from './terms/new-concepts'

export const allTerms: Concept[] = [
  ...aiTerms,
  ...techTerms,
  ...businessBasicsTerms,
  ...financeTerms,
  ...startupTerms,
  ...marketingTerms,
  ...salesTerms,
  ...productManagementTerms,
  ...entrepreneurshipTerms,
  ...investmentTerms,
  ...sharkTankTerms,
  ...businessModelsTerms,
  ...howThingsWorkTerms,
  ...caseStudyTerms,
  ...negotiationTerms,
  ...newConcepts,
]

export const popularTerms = allTerms.filter((t) => t.popular)
export const featuredTerms = allTerms.filter((t) => t.featured)
export const latestTerms = [...allTerms]
  .filter((t) => t.createdAt && !isNaN(new Date(t.createdAt).getTime()))
  .sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

export function getTermBySlug(slug: string): Concept | undefined {
  return allTerms.find((t) => t.slug === slug)
}

export function getTermsByCategory(category: string): Concept[] {
  return allTerms.filter((t) => t.category === category)
}

export function searchTerms(query: string): Concept[] {
  const q = query.toLowerCase()
  return allTerms.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
  )
}

export function getDailyTerm(): Concept | undefined {
  if (allTerms.length === 0) return undefined
  const index = dailySeedIndex(allTerms.length)
  return allTerms[index]
}

export function dailySeedIndex(max: number): number {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % max
}

export const TERM_COUNT = allTerms.length

export function getTermCountForCategory(categoryName: string): number {
  return allTerms.filter((t) => t.category === categoryName).length
}

export {
  aiTerms,
  techTerms,
  businessBasicsTerms,
  financeTerms,
  startupTerms,
  marketingTerms,
  salesTerms,
  productManagementTerms,
  entrepreneurshipTerms,
  investmentTerms,
  sharkTankTerms,
  businessModelsTerms,
  howThingsWorkTerms,
  caseStudyTerms,
  negotiationTerms,
  newConcepts,
}
