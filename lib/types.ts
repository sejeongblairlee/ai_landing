export interface User {
  id: string
  email: string
  provider: string
  created_at: string
}

export interface SearchLog {
  id: string
  user_id: string | null
  task_text: string
  category: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  is_paid: boolean
  plan_name: string
  start_date: string
  end_date: string | null
  created_at: string
}

export interface AIRecommendation {
  name: string
  description: string
  category: string
  features: string[]
  pricing: string
  pros: string[]
  cons: string[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SearchLimit {
  remaining: number
  isLoggedIn: boolean
  isPaid: boolean
}

// 카테고리 타입
export type Category = 
  | '텍스트'
  | '이미지'
  | '영상'
  | '음성'
  | '생산성'
  | '코딩/개발'
  | '마케팅/카피라이팅'
  | '검색/리서치'
  | '디자인/크리에이티브'
  | '교육/학습'

export interface CategoryQuestion {
  question: string
  options: string[]
}
