'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TaskInputProps {
  onSubmit: (task: string) => void
  loading: boolean
  error: string
  remaining: number
}

export function TaskInput({ onSubmit, loading, error, remaining }: TaskInputProps) {
  const [task, setTask] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (task.trim() && !loading) {
      onSubmit(task.trim())
    }
  }

  return (
    <div className="relative animate-fade-in">
      {/* 입력 영역 */}
      <div className="text-center mb-6">
        <h1 className="text-[32px] md:text-[48px] leading-[40px] md:leading-[64px] font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          어떤 작업을<br className="md:hidden" /> 도와드릴까요?
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
          원하는 작업을 자유롭게 입력해주세요.<br />
          AI가 가장 적합한 툴을 추천해드립니다.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="예: 유튜브 썸네일 만들기, 영어 번역, 코드 리뷰..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={loading}
            className="text-lg h-14 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}
        
        <Button
          type="submit"
          disabled={!task.trim() || loading}
          className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ backgroundColor: '#B0FF01', color: '#000000' }}
        >
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
              <span>AI가 분석 중입니다...</span>
            </div>
          ) : (
            'AI 툴 추천받기'
          )}
        </Button>
        
        {remaining !== Infinity && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
            오늘 남은 검색 횟수: {remaining}회
          </p>
        )}
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          💡 팁: 구체적으로 설명할수록 더 정확한 추천을 받을 수 있습니다.
        </p>
      </div>
    </div>
  )
}
