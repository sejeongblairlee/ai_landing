import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Card className="w-full max-w-md bg-white dark:bg-gray-900">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              결제 완료!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              추가 15회 AI 툴 추천을 이용하실 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이제 추가 15회 AI 툴 추천을 받을 수 있습니다.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                크레딧 소진 시 다시 구매하실 수 있습니다.
              </p>
            </div>

            <Button
              className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#B0FF01', color: '#000000' }}
              asChild
            >
              <Link href="/">AI 툴 추천 시작하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
