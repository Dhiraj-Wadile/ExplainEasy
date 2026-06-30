'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeInUp({ children, className, delay = 0 }: MotionWrapperProps) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.45s ease-out ${delay}s, transform 0.45s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export function FadeIn({ children, className, delay = 0 }: MotionWrapperProps) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity 0.4s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={className}>
      {inView && children}
    </div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
    >
      {children}
    </div>
  )
}
