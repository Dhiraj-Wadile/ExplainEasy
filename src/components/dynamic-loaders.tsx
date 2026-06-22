'use client'

import dynamic from 'next/dynamic'

const ChatBotInner = dynamic(() => import('@/components/chat/chat-bot').then((m) => m.ChatBot), {
  ssr: false,
})

const PremiumModalInner = dynamic(() => import('@/components/auth/premium-modal').then((m) => m.PremiumModal), {
  ssr: false,
})

export function ChatBotLoader() {
  return <ChatBotInner />
}

export function PremiumModalLoader() {
  return <PremiumModalInner />
}
