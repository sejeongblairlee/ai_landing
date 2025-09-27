'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const orderId = searchParams.get('orderId')
        const paymentKey = searchParams.get('paymentKey')
        const amount = searchParams.get('amount')

        if (!orderId || !paymentKey || !amount) {
          throw new Error('결제 정보가 올바르지 않습니다.')
        }

        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount)
          })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || '결제 확인에 실패했습니다.')
        }

        setLoading(false)
      } catch (error) {
        console.error('결제 확인 오류:', error)
        setError(error instanceof Error ? error.message : '결제 확인 중 오류가 발생했습니다.')
        setLoading(false)
      }
    }

    confirmPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">결제 확인 실패</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="w-full"
            >
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <CardTitle className="text-2xl font-bold text-green-600">
            결제 완료!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            무제한 AI 툴 추천 서비스를 이용하실 수 있습니다.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              이제 무제한으로 AI 툴을 추천받을 수 있습니다.
            </p>
            <p className="text-sm text-gray-600">
              언제든지 구독을 취소할 수 있습니다.
            </p>
          </div>
          
          <Button
            onClick={() => router.push('/')}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          >
            AI 툴 추천 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
