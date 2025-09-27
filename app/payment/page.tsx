'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { SUBSCRIPTION_PLANS, formatPrice } from '@/lib/payment'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const plan = SUBSCRIPTION_PLANS[0] // Basic Plan

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handlePayment = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError('')

      // Toss Payments 위젯 초기화
      const tossPayments = (window as any).TossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
      
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await tossPayments.requestPayment('카드', {
        amount: plan.price,
        orderId: orderId,
        orderName: plan.name,
        customerName: user.email?.split('@')[0] || '고객',
        customerEmail: user.email || '',
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/payment/fail`
      })
      
    } catch (error) {
      console.error('결제 오류:', error)
      setError('결제 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                무제한 검색 구독
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                월 3달러로 무제한 AI 툴 추천을 받아보세요
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatPrice(plan.price)}
                </div>
                <p className="text-gray-600">월 구독료</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">포함된 기능</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>결제 진행 중...</span>
                    </div>
                  ) : (
                    '지금 구독하기'
                  )}
                </Button>
                
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full h-12"
                >
                  나중에 하기
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>• 언제든지 구독을 취소할 수 있습니다</p>
                <p>• 결제는 Toss Payments를 통해 안전하게 처리됩니다</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
