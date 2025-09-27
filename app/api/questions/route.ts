import { NextRequest, NextResponse } from 'next/server'
import { generateQuestions } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { task } = await request.json()
    
    if (!task) {
      return NextResponse.json(
        { error: '작업 내용이 필요합니다.' },
        { status: 400 }
      )
    }

    // OpenAI API로 질문 생성
    const questions = await generateQuestions(task)
    
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('질문 생성 오류:', error)
    
    if (error instanceof Error && error.message.includes('질문 생성에 실패했습니다')) {
      return NextResponse.json(
        { error: 'AI 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: '질문 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
