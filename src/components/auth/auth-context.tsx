'use client'

import { createContext, useContext } from 'react'
import { useSession } from 'next-auth/react'

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  } | null
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const value: AuthContextValue = {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: session.user.role,
        }
      : null,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
