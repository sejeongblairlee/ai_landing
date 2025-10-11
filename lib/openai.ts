import OpenAI from 'openai'
import { Category, CategoryQuestion, AIRecommendation } from './types'

// 환경 변수 검증
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set');
}

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
}) : null;

// 카테고리 판별 프롬프트
const CATEGORY_PROMPT = `
사용자가 입력한 작업을 다음 10개 카테고리 중 하나로 분류해주세요:

1. 텍스트 - 문서 작성, 번역, 요약 등
2. 이미지 - 이미지 생성, 편집, 변환 등
3. 영상 - 영상 제작, 편집, 변환 등
4. 음성 - 음성 생성, 변환, 인식 등
5. 생산성 - 업무 효율화, 일정 관리 등
6. 코딩/개발 - 프로그래밍, 코드 생성 등
7. 마케팅/카피라이팅 - 광고, 마케팅 콘텐츠 등
8. 검색/리서치 - 정보 검색, 조사 등
9. 디자인/크리에이티브 - 디자인, 창작 등
10. 교육/학습 - 학습, 교육 콘텐츠 등

사용자 작업: "{task}"

응답 형식: 카테고리명만 출력하세요 (예: "텍스트")
`

// 질문 생성 프롬프트
const QUESTION_PROMPT = `
사용자 작업: "{task}"

위 작업을 실제로 수행할 때 전문가들이 가장 중요하게 고려하는 3가지 핵심 요소를 바탕으로 구체적인 질문을 만들어주세요.

중요: 일반적인 질문이 아닌, 해당 작업에 특화된 전문적인 질문이어야 합니다.

질문 구성:
1. 작업의 구체적인 목적과 타겟 (누구를 위한 것인가?)
2. 작업의 규모와 운영 방식 (얼마나 자주, 어떤 방식으로?)
3. 작업의 품질 기준과 제약사항 (어떤 수준의 결과를 원하는가?)

각 질문은 반드시 해당 작업의 실제 사용 시나리오를 반영해야 하며, 일반적인 "어떤 스타일을 선호하시나요?" 같은 질문은 절대 하지 마세요.

각 질문마다 정확히 4개의 현실적이고 구체적인 선택지를 제공하세요.

응답 형식:
1. 질문1
   A) 선택지1
   B) 선택지2
   C) 선택지3
   D) 선택지4

2. 질문2
   A) 선택지1
   B) 선택지2
   C) 선택지3
   D) 선택지4

3. 질문3
   A) 선택지1
   B) 선택지2
   C) 선택지3
   D) 선택지4
`

// AI 툴 추천 프롬프트
const RECOMMENDATION_PROMPT = `
사용자 작업: "{task}"
사용자 답변: {answers}

위 정보를 바탕으로 가장 적합한 AI 툴 2개를 추천해주세요.

각 툴에 대해 다음 정보를 제공해주세요:
- 툴명
- 설명 (50자 이내)
- 주요 기능 3개
- 가격 정보
- 장점 2개
- 단점 1개

응답 형식:
## 추천 AI 툴 1
**툴명**: [툴명]
**설명**: [설명]
**주요 기능**: 
- [기능1]
- [기능2]
- [기능3]
**가격**: [가격 정보]
**장점**: 
- [장점1]
- [장점2]
**단점**: 
- [단점1]

## 추천 AI 툴 2
[동일한 형식]
`

export async function categorizeTask(task: string): Promise<Category> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured')
  }
  
  console.log('OpenAI API 호출 시도 중...')
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: CATEGORY_PROMPT.replace('{task}', task)
      }
    ],
    temperature: 0.3,
    max_tokens: 50
  })

  const category = response.choices[0]?.message?.content?.trim() as Category
  console.log('OpenAI API 응답:', category)
  return category
}

export async function generateQuestions(
  task: string
): Promise<CategoryQuestion[]> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured')
  }
  
  console.log('질문 생성 OpenAI API 호출 중...')
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: QUESTION_PROMPT.replace('{task}', task)
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  })

  const content = response.choices[0]?.message?.content || ''
  console.log('질문 생성 API 응답:', content)
  return parseQuestions(content)
}

export async function generateRecommendations(
  task: string,
  answers: string[]
): Promise<AIRecommendation[]> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured')
  }
  
  console.log('AI 툴 추천 OpenAI API 호출 중...')
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: RECOMMENDATION_PROMPT
          .replace('{task}', task)
          .replace('{answers}', answers.join(', '))
      }
    ],
    temperature: 0.5,
    max_tokens: 1000
  })

  const content = response.choices[0]?.message?.content || ''
  console.log('AI 툴 추천 API 응답:', content)
  return parseRecommendations(content)
}

// 질문 파싱 함수
function parseQuestions(content: string): CategoryQuestion[] {
  console.log('파싱할 내용:', content)
  
  const questions: CategoryQuestion[] = []
  const lines = content.split('\n').filter(line => line.trim())
  
  let currentQuestion: CategoryQuestion | null = null
  
  for (const line of lines) {
    console.log('파싱 중인 라인:', line)
    
    // 질문 라인 (숫자로 시작)
    if (line.match(/^\d+\./)) {
      if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion)
      }
      currentQuestion = {
        question: line.replace(/^\d+\.\s*/, '').trim(),
        options: []
      }
      console.log('새 질문 생성:', currentQuestion.question)
    } 
    // 선택지 라인 (A), B), C), D)로 시작) - 공백 허용
    else if (line.match(/^\s*[A-D]\)/)) {
      if (currentQuestion) {
        const option = line.replace(/^\s*[A-D]\)\s*/, '').trim()
        currentQuestion.options.push(option)
        console.log('선택지 추가:', option)
      }
    }
  }
  
  // 마지막 질문 추가
  if (currentQuestion && currentQuestion.options.length > 0) {
    questions.push(currentQuestion)
  }
  
  console.log('최종 파싱된 질문들:', questions)
  
  // 파싱 실패 시 기본 질문 반환
  if (questions.length === 0) {
    console.log('파싱 실패, 기본 질문 반환')
    return [
      {
        question: '어떤 스타일을 선호하시나요?',
        options: ['간단하고 빠른 것', '고품질 결과물', '다양한 옵션', '사용하기 쉬운 것']
      },
      {
        question: '예산은 어느 정도인가요?',
        options: ['무료', '월 $10 이하', '월 $10-50', '월 $50 이상']
      },
      {
        question: '어떤 수준의 결과를 원하시나요?',
        options: ['기본적인 결과', '전문적인 결과', '창의적인 결과', '빠른 결과']
      }
    ]
  }
  
  return questions.slice(0, 3) // 최대 3개 질문
}

// 추천 파싱 함수
function parseRecommendations(content: string): AIRecommendation[] {
  const recommendations: AIRecommendation[] = []
  const sections = content.split('## 추천 AI 툴')
  
  for (const section of sections.slice(1)) { // 첫 번째는 빈 문자열
    const lines = section.split('\n').filter(line => line.trim())
    const recommendation: Partial<AIRecommendation> = {}
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.includes('**툴명**:')) {
        recommendation.name = line.replace('**툴명**:', '').trim()
      } else if (line.includes('**설명**:')) {
        recommendation.description = line.replace('**설명**:', '').trim()
      } else if (line.includes('**가격**:')) {
        recommendation.pricing = line.replace('**가격**:', '').trim()
      } else if (line.includes('**주요 기능**:')) {
        recommendation.features = []
        let j = i + 1
        while (j < lines.length && lines[j].startsWith('-')) {
          recommendation.features.push(lines[j].replace('-', '').trim())
          j++
        }
      } else if (line.includes('**장점**:')) {
        recommendation.pros = []
        let j = i + 1
        while (j < lines.length && lines[j].startsWith('-')) {
          recommendation.pros.push(lines[j].replace('-', '').trim())
          j++
        }
      } else if (line.includes('**단점**:')) {
        recommendation.cons = []
        let j = i + 1
        while (j < lines.length && lines[j].startsWith('-')) {
          recommendation.cons.push(lines[j].replace('-', '').trim())
          j++
        }
      }
    }
    
    if (recommendation.name) {
      recommendations.push({
        name: recommendation.name,
        description: recommendation.description || '',
        category: '',
        features: recommendation.features || [],
        pricing: recommendation.pricing || '',
        pros: recommendation.pros || [],
        cons: recommendation.cons || []
      })
    }
  }
  
  return recommendations.slice(0, 2) // 최대 2개 추천
}
