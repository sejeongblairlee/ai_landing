'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CategoryQuestion } from '@/lib/types'

interface QuestionStepProps {
  questions: CategoryQuestion[]
  onSubmit: (answers: string[]) => void
  loading: boolean
  error: string
  onRestart: () => void
}

export function QuestionStep({ questions, onSubmit, loading, error, onRestart }: QuestionStepProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''))
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // 디버깅용 로그
  console.log('QuestionStep - questions:', questions)
  console.log('QuestionStep - current question:', questions[currentQuestion])

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onSubmit(answers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const isAnswerSelected = answers[currentQuestion] !== ''
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <Card className="animate-fade-in border-0 shadow-xl bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-semibold text-gray-900 tracking-tight mb-4">
          맞춤형 질문 ({currentQuestion + 1}/{questions.length})
        </CardTitle>
        <CardDescription className="text-xl text-gray-600 font-medium leading-relaxed">
          더 정확한 추천을 위해 몇 가지 질문에 답해주세요.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-8 pb-8">
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-gray-900 text-center leading-relaxed">
            {questions[currentQuestion]?.question}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion] === option
                    ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                }`}
                disabled={loading}
              >
                <span className="font-semibold text-lg">
                  {String.fromCharCode(65 + index)})
                </span>
                <span className="ml-3 text-base font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="flex space-x-4 pt-6">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0 || loading}
            className="flex-1 h-14 text-lg font-semibold rounded-xl border-2"
          >
            이전
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isAnswerSelected || loading}
            className="flex-1 h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>추천 생성 중...</span>
              </div>
            ) : isLastQuestion ? (
              'AI 툴 추천받기'
            ) : (
              '다음 질문'
            )}
          </Button>
        </div>

        <div className="text-center pt-6">
          <Button
            onClick={onRestart}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            처음부터 다시 시작
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
