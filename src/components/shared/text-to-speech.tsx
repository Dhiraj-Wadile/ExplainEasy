'use client'

import { useState, useCallback, useRef } from 'react'
import { Volume2, Loader2 } from 'lucide-react'

interface TextToSpeechProps {
  text: string
  label?: string
}

function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined'
}

export function TextToSpeech({ text, label = 'Listen' }: TextToSpeechProps) {
  const [speaking, setSpeaking] = useState(false)
  const [supported] = useState(isSpeechSupported)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(() => {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find((v) => v.lang.startsWith('en'))
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [text])

  const toggle = useCallback(() => {
    if (speaking) {
      stop()
    } else {
      speak()
    }
  }, [speaking, stop, speak])

  if (!supported) return null

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 transition-colors ${
        speaking ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
      aria-label={speaking ? 'Stop reading' : `Read aloud: ${label}`}
    >
      {speaking ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
