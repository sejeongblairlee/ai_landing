'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentFailPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <CardTitle className="text-2xl font-bold text-red-600">
            결제 실패
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            결제에 실패했습니다. 다시 시도해주세요.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              카드 정보 및 네트워크를 확인 후 다시 시도해주세요.
            </p>
            <p className="text-sm text-gray-600">
              문제가 지속되면 고객 지원팀에 문의해주세요.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={() => router.push('/payment')}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              다시 결제하기
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full h-12"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
