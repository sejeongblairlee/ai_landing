'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  isPaid: boolean
  loading: boolean
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refreshAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      
      if (session?.user) {
        // 구독 상태 확인 (API 호출로 변경)
        try {
          const response = await fetch('/api/user/subscription')
          if (response.ok) {
            const data = await response.json()
            setIsPaid(data.isPaid || false)
          }
        } catch (error) {
          console.error('구독 상태 확인 오류:', error)
          setIsPaid(false)
        }
      } else {
        setIsPaid(false)
      }
    } catch (error) {
      console.error('인증 상태 확인 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        
        if (session?.user) {
          try {
            const response = await fetch('/api/user/subscription')
            if (response.ok) {
              const data = await response.json()
              setIsPaid(data.isPaid || false)
            }
          } catch (error) {
            console.error('구독 상태 확인 오류:', error)
            setIsPaid(false)
          }
        } else {
          setIsPaid(false)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isPaid, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
