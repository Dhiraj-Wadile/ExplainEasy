import { create } from 'zustand'

export type Language = 'english' | 'hinglish' | 'hindi' | 'marathi'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

const LANG_KEY = 'explaineasy_language'

function loadLanguage(): Language {
  if (typeof window === 'undefined') return 'english'
  try {
    const raw = localStorage.getItem(LANG_KEY)
    if (raw === 'hinglish' || raw === 'hindi' || raw === 'marathi' || raw === 'english') return raw
  } catch { /* ignore */ }
  return 'english'
}

function saveLanguage(lang: Language) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch { /* ignore */ }
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: loadLanguage(),
  setLanguage: (language) => {
    saveLanguage(language)
    set({ language })
  },
}))

const LANG_NAMES: Record<Language, string> = {
  english: 'English',
  hinglish: 'Hinglish',
  hindi: 'हिन्दी (Hindi)',
  marathi: 'मराठी (Marathi)',
}

const LANG_FLAGS: Record<Language, string> = {
  english: 'EN',
  hinglish: 'HI-EN',
  hindi: 'HI',
  marathi: 'MR',
}

export function getLanguageLabel(lang: Language): string {
  return LANG_NAMES[lang]
}

export function getLanguageFlag(lang: Language): string {
  return LANG_FLAGS[lang]
}

const translationCache = new Map<string, { translated: string; expiry: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

export async function translateText(text: string, targetLang: Language): Promise<string> {
  if (targetLang === 'english' || !text) return text

  const cacheKey = `${targetLang}:${text.slice(0, 100)}`
  const cached = translationCache.get(cacheKey)
  if (cached && Date.now() < cached.expiry) return cached.translated

  try {
    const { generateChatResponse } = await import('./openai')
    const langPrompt = targetLang === 'hinglish'
      ? 'Hinglish (Hindi + English mix, use Hindi script for key terms, Devanagari + Roman mix)'
      : targetLang === 'hindi'
        ? 'Hindi (हिन्दी, in Devanagari script)'
        : 'Marathi (मराठी, in Devanagari script)'

    const result = await generateChatResponse([{
      role: 'user',
      content: `Translate the following business/tech explanation to ${langPrompt}. Keep it simple and natural. Return ONLY the translation, no explanations.

Text: "${text}"`
    }])

    const translated = result.trim()
    translationCache.set(cacheKey, { translated, expiry: Date.now() + CACHE_TTL })
    return translated
  } catch {
    return text
  }
}
