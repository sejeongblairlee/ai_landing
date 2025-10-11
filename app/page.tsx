'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { TaskInput } from '@/components/task-input'
import { QuestionStep } from '@/components/question-step'
import { RecommendationStep } from '@/components/recommendation-step'
import { SearchLimitModal } from '@/components/search-limit-modal'
import { useSearchLimit } from '@/hooks/use-search-limit'
import { CategoryQuestion, AIRecommendation } from '@/lib/types'

type Step = 'input' | 'questions' | 'recommendations'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('input')
  const [task, setTask] = useState('')
  const [questions, setQuestions] = useState<CategoryQuestion[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { searchLimit, refreshLimit } = useSearchLimit()
  const [showLimitModal, setShowLimitModal] = useState(false)

  // 초기 상태로 리셋하는 함수
  const resetToInitial = () => {
    setCurrentStep('input')
    setTask('')
    setQuestions([])
    setAnswers([])
    setRecommendations([])
    setLoading(false)
    setError('')
    setShowLimitModal(false)
  }

  const handleTaskSubmit = async (taskText: string) => {
    if (!searchLimit?.canSearch) {
      setShowLimitModal(true)
      return
    }

    try {
      setLoading(true)
      setError('')
      setTask(taskText)

      // 질문 생성 (카테고리 단계 생략)
      const questionResponse = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskText })
      })

      if (!questionResponse.ok) {
        const questionData = await questionResponse.json()
        throw new Error(questionData.error || '질문 생성에 실패했습니다.')
      }

      const questionData = await questionResponse.json()
      setQuestions(questionData.questions)
      setCurrentStep('questions')
      
    } catch (error) {
      console.error('작업 처리 오류:', error)
      setError(error instanceof Error ? error.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswersSubmit = async (userAnswers: string[]) => {
    try {
      setLoading(true)
      setError('')
      setAnswers(userAnswers)

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: task, 
          answers: userAnswers 
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'AI 툴 추천에 실패했습니다.')
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
      setCurrentStep('recommendations')
      
    } catch (error) {
      console.error('추천 생성 오류:', error)
      setError(error instanceof Error ? error.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    setCurrentStep('input')
    setTask('')
    setQuestions([])
    setAnswers([])
    setRecommendations([])
    setError('')
    refreshLimit()
  }

  const handleLoginSuccess = () => {
    refreshLimit()
    setShowLimitModal(false)
  }

    return (
      <div className="min-h-screen bg-white dark:bg-background">
        <Header />
        
        {/* Hero 섹션 - 초기 랜딩에만 표시 */}
        {currentStep === 'input' && (
          <div className="relative">
            <Hero />
            
            {/* TaskInput을 Hero 위에 겹치기 */}
            <div className="absolute top-0 left-0 w-full z-10">
              <div className="max-w-4xl mx-auto px-6 pt-40">
                <div className="max-w-3xl mx-auto">
                  <TaskInput 
                    onSubmit={handleTaskSubmit}
                    loading={loading}
                    error={error}
                    remaining={searchLimit?.remaining || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 검색 후 페이지에서는 일반 레이아웃 */}
        {currentStep !== 'input' && (
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="max-w-3xl mx-auto">
              {currentStep === 'input' && (
                <TaskInput 
                  onSubmit={handleTaskSubmit}
                  loading={loading}
                  error={error}
                  remaining={searchLimit?.remaining || 0}
                />
              )}
            </div>
          </div>
        )}
        
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="max-w-3xl mx-auto">
          
            {currentStep === 'questions' && questions.length > 0 && (
            <QuestionStep 
              questions={questions}
              onSubmit={handleAnswersSubmit}
              loading={loading}
              error={error}
              onRestart={handleRestart}
            />
          )}
          
          {currentStep === 'recommendations' && recommendations.length > 0 && (
            <RecommendationStep 
              recommendations={recommendations}
              task={task}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>

      <SearchLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        isLoggedIn={searchLimit?.isLoggedIn || false}
        remaining={searchLimit?.remaining || 0}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
