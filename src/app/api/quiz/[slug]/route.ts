import { NextResponse } from 'next/server'
import { getTermBySlug } from '@/data'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateWrongOptions(answerWord: string) {
  const pool = [
    'a method of calculating depreciation',
    'a framework for market analysis',
    'a technique for team management',
    'a strategy for customer retention',
    'a model for pricing optimization',
    'a tool for supply chain management',
    'a process for quality assurance',
    'a system for inventory tracking',
    'a method for risk assessment',
    'an approach for brand building',
    'a metric for measuring employee productivity',
    'a standard for financial reporting',
  ]
  return shuffleArray(pool).filter((p) => !p.toLowerCase().includes(answerWord.toLowerCase())).slice(0, 4)
}

function generateQuiz(conceptSlug: string) {
  const concept = getTermBySlug(conceptSlug)
  if (!concept) return null

  const questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }[] = []

  let qIndex = 0

  // Question 1: Definition-based
  if (concept.definition) {
    const def = concept.definition
    const sentences = def.split(/[.!?]+/).filter((s) => s.trim().length > 20)
    if (sentences.length > 0) {
      const keySentence = sentences[0].trim()
      const words = keySentence.split(' ').filter((w) => w.length > 4)
      const answerWord = words.length > 2 ? words[Math.floor(words.length / 2)] : concept.name.split(' ')[0]
      const wrongOptions = generateWrongOptions(answerWord)
      qIndex++
      questions.push({
        id: `${conceptSlug}-q${qIndex}`,
        question: `What is the best definition of ${concept.name}?`,
        options: shuffleArray([
          keySentence,
          ...wrongOptions.slice(0, 3).map((w) => `${concept.name} refers to ${w.toLowerCase()}`),
        ]),
        correctAnswer: 0,
        explanation: `${concept.name}: ${keySentence.slice(0, 200)}.`,
      })
    }
  }

  // Question 2: Simple explanation
  if (concept.simpleExplanation) {
    const sentences = concept.simpleExplanation.split(/[.!?]+/).filter((s) => s.trim().length > 10)
    if (sentences.length > 0) {
      const correct = sentences[0].trim()
      const alternatives = sentences.slice(1, 4).map((s) => s.trim()).filter((s) => s.length > 10)
      qIndex++
      const fallbackOptions = alternatives.length >= 3 ? alternatives : [
        `${concept.name} is a complex financial metric used by institutional investors.`,
        `${concept.name} is a type of marketing strategy primarily used by technology startups.`,
        `${concept.name} is a legal framework for corporate governance and regulatory compliance.`,
        `${concept.name} refers to the process of optimizing supply chain logistics.`,
      ]
      questions.push({
        id: `${conceptSlug}-q${qIndex}`,
        question: `Which statement best describes ${concept.name} in simple terms?`,
        options: shuffleArray([correct, ...fallbackOptions.slice(0, 3)]),
        correctAnswer: 0,
        explanation: `In simple terms: ${correct.slice(0, 200)}.`,
      })
    }
  }

  // Question 3: Real-world example
  if (concept.example) {
    const example = concept.example.length > 100 ? concept.example.slice(0, 100) + '...' : concept.example
    qIndex++
    const correctIdx = 0
    questions.push({
      id: `${conceptSlug}-q${qIndex}`,
      question: `Which is a real-world example of ${concept.name}?`,
      options: shuffleArray([
        example,
        `A company uses ${concept.name} to reduce employee salaries without their consent.`,
        `${concept.name} is used primarily for avoiding tax obligations in multinational corporations.`,
        `Companies apply ${concept.name} to eliminate customer feedback mechanisms.`,
      ]),
      correctAnswer: correctIdx,
      explanation: `Example: ${concept.example.slice(0, 250)}`,
    })
  }

  // Question 4: Common mistakes
  const mistakes = concept.commonMistakes?.filter((m) => m.trim().length > 5)
  if (mistakes && mistakes.length > 0) {
    const correct = mistakes[0]
    const others = mistakes.slice(1, 4)
    qIndex++
    questions.push({
      id: `${conceptSlug}-q${qIndex}`,
      question: `Which is a common mistake people make about ${concept.name}?`,
      options: shuffleArray([
        correct,
        ...(others.length >= 3 ? others : [
          `Thinking ${concept.name} is illegal in most developed countries.`,
          `Believing ${concept.name} was invented in the early 21st century.`,
          `Assuming ${concept.name} only applies to technology and software companies.`,
          `Thinking ${concept.name} is the same as revenue or total sales.`,
        ]).slice(0, 3),
      ]),
      correctAnswer: 0,
      explanation: `Common mistake: ${correct}`,
    })
  }

  // Question 5: Why it matters
  if (concept.whyItMatters) {
    const sentences = concept.whyItMatters.split(/[.!?]+/).filter((s) => s.trim().length > 15)
    if (sentences.length > 0) {
      const correct = sentences[0].trim()
      qIndex++
      questions.push({
        id: `${conceptSlug}-q${qIndex}`,
        question: `Why does ${concept.name} matter in business?`,
        options: shuffleArray([
          correct,
          `${concept.name} matters because it allows companies to bypass government regulations.`,
          `${concept.name} is important only for academic research and theoretical discussions.`,
          `${concept.name} matters because it reduces the need for customer service teams.`,
          `${concept.name} is critical for minimizing employee salaries and benefits.`,
        ]),
        correctAnswer: 0,
        explanation: correct.slice(0, 250),
      })
    }
  }

  // If we still have fewer than 3 questions, generate fallback questions
  if (qIndex < 3) {
    const tags = concept.tags?.slice(0, 4) || []
    const tagStr = tags.length > 0 ? tags.join(', ') : concept.category

    if (!questions.find((q) => q.id.includes('tag-q'))) {
      qIndex++
      questions.push({
        id: `${conceptSlug}-q${qIndex}`,
        question: `Which of the following is related to ${concept.name}?`,
        options: shuffleArray([
          tagStr,
          `Inventory management and supply chain logistics`,
          `Human resource compliance and labor laws`,
          `Real estate property management`,
        ]),
        correctAnswer: 0,
        explanation: `${concept.name} is related to: ${tagStr}.`,
      })
    }
  }

  if (qIndex < 3) {
    qIndex++
    questions.push({
      id: `${conceptSlug}-q${qIndex}`,
      question: `What category does ${concept.name} belong to?`,
      options: shuffleArray([
        concept.category,
        ...['Finance', 'Marketing', 'Technology', 'Human Resources'].filter((c) => c !== concept.category).slice(0, 3),
      ]),
      correctAnswer: 0,
      explanation: `${concept.name} is categorized under ${concept.category}.`,
    })
  }

  return questions.slice(0, 5)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const ip = _request.headers.get('x-forwarded-for') || 'unknown'
  const rl = await rateLimit(`quiz:${ip}`, 30, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter!)

  const concept = getTermBySlug(slug)
  if (!concept) {
    return NextResponse.json({ error: 'Concept not found' }, { status: 404 })
  }

  const questions = generateQuiz(slug)
  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'Could not generate quiz' }, { status: 500 })
  }

  return NextResponse.json({
    concept: { name: concept.name, slug: concept.slug },
    questions,
  })
}
