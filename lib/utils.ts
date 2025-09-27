import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// IP 주소 추출 함수
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// 한국 시간 기준 날짜 가져오기
export function getKoreaDate(): string {
  const now = new Date()
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)) // UTC+9
  return koreaTime.toISOString().split('T')[0] // YYYY-MM-DD 형식
}

// 검색 횟수 제한 확인
export function getSearchLimit(
  isLoggedIn: boolean,
  isPaid: boolean,
  dailySearchCount: number
): { remaining: number; canSearch: boolean } {
  if (isPaid) {
    return { remaining: Infinity, canSearch: true }
  }
  
  if (isLoggedIn) {
    const limit = 5
    return { remaining: Math.max(0, limit - dailySearchCount), canSearch: dailySearchCount < limit }
  }
  
  const limit = 2
  return { remaining: Math.max(0, limit - dailySearchCount), canSearch: dailySearchCount < limit }
}
