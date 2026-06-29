'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatContext, useChatHistory } from '@/lib/store'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function formatContent(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!line.trim()) {
      nodes.push(<div key={key++} className="h-2" />)
      continue
    }

    const trimmed = line.trim()

    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      const content = trimmed.replace(/^[•\-]\s*/, '')
      nodes.push(
        <div key={key++} className="flex gap-2 text-sm">
          <span className="text-primary shrink-0 mt-0.5">•</span>
          <span>{content}</span>
        </div>
      )
    } else if (/^\d+[.)]/.test(trimmed)) {
      const prefix = trimmed.match(/^\d+[.)]/)?.[0] || ''
      const rest = trimmed.slice(prefix.length).trim()
      nodes.push(
        <div key={key++} className="flex gap-2 text-sm">
          <span className="text-primary shrink-0 mt-0.5 font-medium">{prefix}</span>
          <span>{rest}</span>
        </div>
      )
    } else {
      const parts = line.split(/(:\s)/).map((part, j) => {
        if (part.endsWith(':') && part.length > 1) {
          return <strong key={j}>{part}</strong>
        }
        return part
      })
      nodes.push(<div key={key++} className="text-sm leading-relaxed">{parts}</div>)
    }
  }

  return nodes
}

export function ChatBot() {
  const { concept } = useChatContext()
  const { history, addMessage, clearHistory } = useChatHistory()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return
    setInitialized(true)

    if (history.length > 0) {
      setMessages(history)
    } else {
      setMessages([
        {
          role: 'assistant',
          content: concept
            ? `Hi! I'm ExplainEasy AI. Ask me about ${concept.name} — I can simplify it, give examples, or compare it with related concepts.`
            : `Hi! I'm ExplainEasy AI. Ask me about business, finance, startups, or tech concepts. I keep answers short and to the point.`,
        },
      ])
    }
  }, [concept?.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    addMessage(userMsg)
    setInput('')
    setLoading(true)

    try {
      const body: Record<string, unknown> = { messages: updated }
      if (concept) body.concept = concept

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const errMsg: Message = { role: 'assistant', content: err.error || 'Request failed' }
        setMessages((prev) => [...prev, errMsg])
        addMessage(errMsg)
        setLoading(false)
        return
      }

      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('text/event-stream')) {
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No readable stream')

        const decoder = new TextDecoder()
        let buffer = ''
        let accumulatedContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data: ')) continue
            const data = trimmed.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulatedContent += parsed.content
                setMessages((prev) => {
                  const next = [...prev]
                  next[next.length - 1] = { role: 'assistant', content: accumulatedContent }
                  return next
                })
              }
            } catch { /* skip */ }
          }
        }

        if (accumulatedContent) {
          addMessage({ role: 'assistant', content: accumulatedContent })
        }
      } else {
        const data = await res.json()
        const reply: Message = { role: 'assistant', content: data.content || data.error || 'No response received.' }
        setMessages((prev) => [...prev, reply])
        addMessage(reply)
      }
    } catch {
      const errMsg: Message = { role: 'assistant', content: 'Having trouble responding. Please try again.' }
      setMessages((prev) => [...prev, errMsg])
      addMessage(errMsg)
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, concept, addMessage])

  function handleClear() {
    clearHistory()
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I'm ExplainEasy AI. Ask me about business, finance, startups, or tech concepts. I keep answers short and to the point.`,
      },
    ])
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col"
          >
            <div className="flex flex-col h-full">
              <header className="border-b border-border shrink-0">
                <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">ExplainEasy AI</p>
                      {concept ? (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {concept.name}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Ask me anything</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {messages.length > 1 && (
                      <button
                        onClick={handleClear}
                        title="Clear chat"
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-5">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={`${
                          msg.role === 'user' ? 'max-w-[70%] sm:max-w-[60%]' : 'max-w-[85%] sm:max-w-[75%]'
                        } px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {formatContent(msg.content)}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-muted/50 px-4 py-3 rounded-2xl">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDuration: '0.6s' }} />
                          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.15s' }} />
                          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.3s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </main>

              <footer className="border-t border-border shrink-0">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about any concept..."
                      className="flex-1 px-4 py-3 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
      )}
    </>
  )
}
