// Toss Payments 관련 타입 정의

export interface PaymentRequest {
  orderId: string
  amount: number
  orderName: string
  customerName: string
  customerEmail: string
}

export interface PaymentResponse {
  success: boolean
  paymentKey?: string
  orderId?: string
  amount?: number
  error?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
}

// 결제 플랜 정의
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 3000, // 3달러를 원화로 (대략 3000원)
    description: '무제한 AI 툴 추천',
    features: [
      '무제한 검색',
      '모든 카테고리 지원',
      '상세한 AI 툴 비교',
      '우선 고객 지원'
    ]
  }
]

// 결제 관련 유틸리티 함수
export function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// 결제 검증 함수
export function validatePaymentData(data: any): boolean {
  return (
    data &&
    typeof data.paymentKey === 'string' &&
    typeof data.orderId === 'string' &&
    typeof data.amount === 'number'
  )
}
