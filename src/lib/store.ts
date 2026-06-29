import { create } from 'zustand'

const STORAGE_KEY = 'explaineasy_favorites'

function loadFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch { /* quota exceeded */ }
}

interface FavoritesState {
  favorites: string[]
  addFavorite: (slug: string) => void
  removeFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: loadFavorites(),
  addFavorite: (slug) =>
    set((state) => {
      if (state.favorites.includes(slug)) return state
      const next = [...state.favorites, slug]
      saveFavorites(next)
      return { favorites: next }
    }),
  removeFavorite: (slug) =>
    set((state) => {
      const next = state.favorites.filter((f) => f !== slug)
      saveFavorites(next)
      return { favorites: next }
    }),
  isFavorite: (slug) => get().favorites.includes(slug),
}))

interface SearchState {
  query: string
  setQuery: (query: string) => void
  isSearchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true, query: '' }),
  closeSearch: () => set({ isSearchOpen: false, query: '' }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen, query: '' })),
}))

interface UIState {
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
}))

interface ChatContextState {
  concept: { name: string; slug: string; definition: string; category: string } | null
  setConcept: (concept: { name: string; slug: string; definition: string; category: string } | null) => void
}

export const useChatContext = create<ChatContextState>((set) => ({
  concept: null,
  setConcept: (concept) => set({ concept }),
}))

const CHAT_HISTORY_KEY = 'explaineasy_chat_history'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function loadChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveChatHistory(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-20)))
  } catch { /* quota */ }
}

interface ChatHistoryState {
  history: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  clearHistory: () => void
}

export const useChatHistory = create<ChatHistoryState>((set) => ({
  history: loadChatHistory(),
  addMessage: (msg) =>
    set((state) => {
      const next = [...state.history, msg]
      saveChatHistory(next)
      return { history: next }
    }),
  clearHistory: () => {
    saveChatHistory([])
    set({ history: [] })
  },
}))
