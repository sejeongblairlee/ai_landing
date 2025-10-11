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
      
      if (!response.ok) {
        // API 오류 시 기본값 설정
        setSearchLimit({
          remaining: 2,
          canSearch: true,
          isLoggedIn: false,
          isPaid: false,
          dailySearchCount: 0
        })
        return
      }
      
      const data = await response.json()
      setSearchLimit(data)
    } catch (error) {
      console.error('검색 제한 확인 오류:', error)
      // 네트워크 오류 시 기본값 설정
      setSearchLimit({
        remaining: 2,
        canSearch: true,
        isLoggedIn: false,
        isPaid: false,
        dailySearchCount: 0
      })
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
