import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import Link from 'next/link'

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Card className="w-full max-w-md bg-white dark:bg-gray-900">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              결제 실패
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              결제에 실패했습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                카드 정보 및 네트워크를 확인 후 다시 시도해주세요.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                문제가 지속되면 고객 지원팀에 문의해주세요.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: '#B0FF01', color: '#000000' }}
                asChild
              >
                <Link href="/pricing">다시 결제하기</Link>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                asChild
              >
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
