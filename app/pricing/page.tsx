import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { Header } from '@/components/header'
import TossWidget from '@/components/payments/TossWidget'
import Link from 'next/link'

export default function PricingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            가격 플랜
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            AI 툴 추천 서비스를 위한 최적의 플랜을 선택하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Free
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/월</span>
              </div>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                기본 AI 툴 추천 서비스
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">일일 3회 무료 검색</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">맞춤형 AI 툴 추천</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">상세한 툴 정보 제공</span>
                </li>
              </ul>
              <Button
                className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: '#B0FF01', color: '#000000' }}
                asChild
              >
                <Link href="/">무료로 시작하기</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative bg-white dark:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                인기
              </span>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Premium
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$3</span>
                <span className="text-gray-600 dark:text-gray-400">/월</span>
              </div>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                추가 검색 크레딧 구매
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">추가 15회 검색 크레딧</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">맞춤형 AI 툴 추천</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">상세한 툴 정보 제공</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">우선 고객 지원</span>
                </li>
              </ul>
              
              {user ? (
                <div className="space-y-4">
                  <TossWidget amount={3} />
                </div>
              ) : (
                <Button
                  className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ backgroundColor: '#B0FF01', color: '#000000' }}
                  asChild
                >
                  <Link href="/login">로그인 후 구매하기</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            더 많은 질문이 있으신가요?
          </p>
          <Button
            variant="outline"
            className="rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            asChild
          >
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}