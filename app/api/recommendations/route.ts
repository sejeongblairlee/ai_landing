import { NextRequest, NextResponse } from 'next/server'
import { generateRecommendations } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { task, answers } = await request.json()
    
    if (!task || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: '작업 내용과 답변이 필요합니다.' },
        { status: 400 }
      )
    }

    // OpenAI API로 AI 툴 추천
    const recommendations = await generateRecommendations(task, answers)
    
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('AI 툴 추천 오류:', error)
    
    if (error instanceof Error && error.message.includes('AI 툴 추천에 실패했습니다')) {
      return NextResponse.json(
        { error: 'AI 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'AI 툴 추천에 실패했습니다.' },
      { status: 500 }
    )
  }
}
