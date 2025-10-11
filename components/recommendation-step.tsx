'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIRecommendation } from '@/lib/types'

interface RecommendationStepProps {
  recommendations: AIRecommendation[]
  task: string
  onRestart: () => void
}

export function RecommendationStep({ recommendations, task, onRestart }: RecommendationStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            🎉 AI 툴 추천 결과
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            "{task}" 작업에 가장 적합한 AI 툴을 추천해드립니다.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {recommendations.map((rec, index) => (
          <Card key={index} className="h-full bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {rec.name}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {rec.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">주요 기능</h4>
                <ul className="space-y-1">
                  {rec.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">가격</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{rec.pricing}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">장점</h4>
                  <ul className="space-y-1">
                    {rec.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-green-600 dark:text-green-400 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">단점</h4>
                  <ul className="space-y-1">
                    {rec.cons.map((con, i) => (
                      <li key={i} className="text-sm text-red-600 dark:text-red-400 flex items-start">
                        <span className="text-red-500 mr-2">⚠</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    // TODO: 외부 링크로 이동
                    console.log(`Visit ${rec.name} website`)
                  }}
                  className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ backgroundColor: '#B0FF01', color: '#000000' }}
                >
                  공식 사이트로 이동
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white dark:bg-gray-900">
        <CardContent className="text-center py-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            추천 결과가 마음에 드시나요? 다른 작업도 시도해보세요!
          </p>
          <Button
            onClick={onRestart}
            className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: '#B0FF01', color: '#000000' }}
          >
            새로운 작업 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
