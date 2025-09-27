'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="animate-fade-in border-0 shadow-xl bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-4xl font-semibold text-gray-900 tracking-tight mb-4">
          어떤 작업을 도와드릴까요?
        </CardTitle>
        <CardDescription className="text-xl text-gray-600 font-medium leading-relaxed">
          원하는 작업을 자유롭게 입력해주세요.<br />
          AI가 가장 적합한 툴을 추천해드립니다.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="예: 유튜브 썸네일 만들기, 영어 번역, 코드 리뷰..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              disabled={loading}
              className="text-lg h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
            />
            {remaining !== Infinity && (
              <p className="text-sm text-gray-500 text-center font-medium">
                오늘 남은 검색 횟수: {remaining}회
              </p>
            )}
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={!task.trim() || loading}
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>AI가 분석 중입니다...</span>
              </div>
            ) : (
              'AI 툴 추천받기'
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            💡 팁: 구체적으로 설명할수록 더 정확한 추천을 받을 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
