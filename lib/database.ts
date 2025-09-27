import { createClient } from './supabase-server'
import { SearchLog, Subscription, User } from './types'

// 검색 로그 저장
export async function saveSearchLog(
  userId: string | null,
  taskText: string,
  category: string,
  ipAddress?: string
): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('search_logs')
    .insert({
      user_id: userId,
      task_text: taskText,
      category: category,
      ip_address: ipAddress || 'unknown'
    })
  
  if (error) {
    console.error('검색 로그 저장 오류:', error)
    throw new Error('검색 로그 저장에 실패했습니다.')
  }
}

// 일일 검색 횟수 조회 (IP 기반)
export async function getDailySearchCount(ip: string): Promise<number> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  
  const { count, error } = await supabase
    .from('search_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lte('created_at', `${today}T23:59:59.999Z`)
  
  if (error) {
    console.error('검색 횟수 조회 오류:', error)
    return 0
  }
  
  return count || 0
}

// 사용자 일일 검색 횟수 조회
export async function getUserDailySearchCount(userId: string): Promise<number> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  
  const { count, error } = await supabase
    .from('search_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lte('created_at', `${today}T23:59:59.999Z`)
  
  if (error) {
    console.error('사용자 검색 횟수 조회 오류:', error)
    return 0
  }
  
  return count || 0
}

// 사용자 구독 정보 조회
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_paid', true)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // 구독 정보 없음
    }
    console.error('구독 정보 조회 오류:', error)
    return null
  }
  
  return data
}

// 사용자 정보 조회
export async function getUser(userId: string): Promise<User | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('사용자 정보 조회 오류:', error)
    return null
  }
  
  return data
}

// 사용자 생성 (이메일 로그인 시)
export async function createUser(userData: {
  id: string
  email: string
  provider: string
}): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .insert({
      id: userData.id,
      email: userData.email,
      provider: userData.provider
    })
  
  if (error) {
    console.error('사용자 생성 오류:', error)
    throw new Error('사용자 생성에 실패했습니다.')
  }
}

// 구독 생성 (결제 성공 시)
export async function createSubscription(
  userId: string,
  planName: string = 'basic'
): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      is_paid: true,
      plan_name: planName,
      start_date: new Date().toISOString(),
      end_date: null // 무제한
    })
  
  if (error) {
    console.error('구독 생성 오류:', error)
    throw new Error('구독 생성에 실패했습니다.')
  }
}
