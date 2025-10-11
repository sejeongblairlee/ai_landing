import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 클라이언트 IP 주소 가져오기
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return '127.0.0.1'
}

// 한국 시간 기준 날짜 가져오기
export function getKoreaDate(): string {
  const now = new Date()
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)) // UTC+9
  return koreaTime.toISOString().split('T')[0]
}

// 검색 제한 로직 (크레딧 기반)
export function getSearchLimit(isLoggedIn: boolean, isPaid: boolean, dailySearchCount: number, creditCount: number = 0) {
  // 결제 사용자: 크레딧 기반
  if (isPaid) {
    return {
      remaining: creditCount,
      canSearch: creditCount > 0
    }
  }
  
  // 비로그인 사용자: 하루 3회 제한
  const maxSearches = 3
  const remaining = Math.max(0, maxSearches - dailySearchCount)
  const canSearch = remaining > 0
  
  return {
    remaining,
    canSearch
  }
}
