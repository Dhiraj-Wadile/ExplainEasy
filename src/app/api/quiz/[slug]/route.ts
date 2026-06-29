import { NextResponse } from 'next/server'
import { getTermBySlug } from '@/data'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

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

  if (concept.definition) {
    const def = concept.definition
    const sentences = def.split(/[.!?]+/).filter((s) => s.trim().length > 20)
    if (sentences.length > 1) {
      const keySentence = sentences[0].trim()
      const words = keySentence.split(' ').filter((w) => w.length > 4)
      if (words.length > 2) {
        const answerWord = words[Math.floor(words.length / 2)]
        const wrongOptions = generateWrongOptions(answerWord, concept)
        questions.push({
          id: `${conceptSlug}-q1`,
          question: `What is the best definition of ${concept.name}?`,
          options: shuffleArray([
            keySentence,
            ...wrongOptions.slice(0, 3).map((w) => `${concept.name} refers to ${w.toLowerCase()}`),
          ]),
          correctAnswer: 0,
          explanation: `${concept.name}: ${keySentence}.`,
        })
      }
    }
  }

  if (concept.simpleExplanation) {
    const sentences = concept.simpleExplanation.split(/[.!?]+/).filter((s) => s.trim().length > 15)
    if (sentences.length > 1) {
      const correct = sentences[0].trim()
      const alternatives = sentences.slice(1, 4).map((s) => s.trim()).filter((s) => s.length > 10)
      questions.push({
        id: `${conceptSlug}-q2`,
        question: `Which statement best describes ${concept.name} in simple terms?`,
        options: shuffleArray([
          correct,
          ...(alternatives.length >= 3 ? alternatives : [
            `${concept.name} is a complex financial metric used by investors.`,
            `${concept.name} is a type of marketing strategy for startups.`,
            `${concept.name} is a legal framework for business operations.`,
          ]),
        ]),
        correctAnswer: 0,
        explanation: `In simple terms: ${correct}.`,
      })
    }
  }

  if (concept.example) {
    const example = concept.example.length > 80 ? concept.example.slice(0, 80) + '...' : concept.example
    const fakeExamples = [
      `A company uses ${concept.name} to reduce employee salaries.`,
      `${concept.name} is used primarily for tax evasion in large corporations.`,
      `Companies apply ${concept.name} to avoid customer feedback.`,
      `${concept.name} helps businesses ignore market competition.`,
    ]
    questions.push({
      id: `${conceptSlug}-q3`,
      question: `Which is a real-world example of ${concept.name}?`,
      options: shuffleArray([
        example,
        ...fakeExamples.slice(0, 3),
      ]),
      correctAnswer: 0,
      explanation: `Example: ${concept.example}`,
    })
  }

  if (concept.commonMistakes && concept.commonMistakes.length > 0) {
    const correct = concept.commonMistakes[0]
    const mistakes = concept.commonMistakes.slice(1, 4)
    questions.push({
      id: `${conceptSlug}-q4`,
      question: `Which is a common mistake people make about ${concept.name}?`,
      options: shuffleArray([
        correct,
        ...(mistakes.length >= 3 ? mistakes : [
          `Thinking ${concept.name} is illegal in most countries.`,
          `Believing ${concept.name} was invented in the 21st century.`,
          `Assuming ${concept.name} only applies to technology companies.`,
        ]),
      ]),
      correctAnswer: 0,
      explanation: `Common mistake: ${correct}`,
    })
  }

  if (concept.whyItMatters) {
    const sentences = concept.whyItMatters.split(/[.!?]+/).filter((s) => s.trim().length > 15)
    if (sentences.length > 0) {
      const correct = sentences[0].trim()
      questions.push({
        id: `${conceptSlug}-q5`,
        question: `Why does ${concept.name} matter?`,
        options: shuffleArray([
          correct,
          `${concept.name} matters because it allows companies to avoid regulations.`,
          `${concept.name} is important only for academic research purposes.`,
          `${concept.name} matters because it reduces the need for customer service.`,
        ]),
        correctAnswer: 0,
        explanation: correct,
      })
    }
  }

  return questions.slice(0, 5)
}

function generateWrongOptions(answerWord: string, concept: { name: string; tags?: string[]; category?: string }) {
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
    'a approach for brand building',
  ]
  return shuffleArray(pool).filter((p) => !p.toLowerCase().includes(answerWord.toLowerCase())).slice(0, 4)
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
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
