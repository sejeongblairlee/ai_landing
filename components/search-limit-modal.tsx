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
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
            {isLoggedIn ? '검색 횟수 초과' : '무료 검색 횟수 초과'}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 font-medium">
            {isLoggedIn 
              ? '오늘 무료 검색 횟수를 모두 사용했습니다.'
              : '오늘 무료 검색 횟수를 모두 사용했습니다.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          {!isLoggedIn ? (
            <div className="text-center space-y-6">
              <p className="text-base text-gray-600 font-medium">
                로그인하면 하루 3회 추가 무료 검색이 가능합니다!
              </p>
              <div className="space-y-3">
                <Link href="/login" onClick={handleLoginSuccess}>
                  <Button className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    로그인하기
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-12 text-lg font-medium rounded-xl border-2"
                >
                  나중에 하기
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <p className="text-base text-gray-600 font-medium">
                월 3달러로 무제한 검색이 가능합니다.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handlePayment}
                  className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  월 3달러로 무제한 검색하기
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-12 text-lg font-medium rounded-xl border-2"
                >
                  나중에 하기
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
