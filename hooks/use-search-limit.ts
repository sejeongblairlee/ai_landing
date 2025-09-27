'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'

interface SearchLimit {
  remaining: number
  canSearch: boolean
  isLoggedIn: boolean
  isPaid: boolean
  dailySearchCount: number
}

export function useSearchLimit() {
  const [searchLimit, setSearchLimit] = useState<SearchLimit | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, isPaid } = useAuth()

  const checkSearchLimit = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/search-limit')
      const data = await response.json()
      
      if (response.ok) {
        setSearchLimit(data)
      } else {
        console.error('검색 제한 확인 오류:', data.error)
      }
    } catch (error) {
      console.error('검색 제한 확인 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSearchLimit()
  }, [user, isPaid])

  const refreshLimit = () => {
    checkSearchLimit()
  }

  return {
    searchLimit,
    loading,
    refreshLimit
  }
}
