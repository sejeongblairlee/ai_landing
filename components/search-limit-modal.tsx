'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SearchLimitModalProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn: boolean
  remaining: number
  onLoginSuccess?: () => void
}

export function SearchLimitModal({
  isOpen,
  onClose,
  isLoggedIn,
  remaining,
  onLoginSuccess
}: SearchLimitModalProps) {
  const [showPayment, setShowPayment] = useState(false)

  if (!isOpen) return null

  const handleLoginSuccess = () => {
    onLoginSuccess?.()
    onClose()
  }

  const handlePayment = () => {
    // TODO: 결제 페이지로 이동
    console.log('결제 페이지로 이동')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {isLoggedIn ? '검색 횟수 초과' : '무료 검색 횟수 초과'}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            오늘 무료 검색 횟수를 모두 사용했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="text-center space-y-6">
            <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
              추가 검색을 위해 크레딧을 구매하세요.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                className="w-full h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: '#B0FF01', color: '#000000' }}
              >
                $3로 15회 추가 검색하기
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-12 text-lg font-medium rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                나중에 하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
