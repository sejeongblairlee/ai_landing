import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getClientIP, getKoreaDate, getSearchLimit } from '@/lib/utils'
import { getUserDailySearchCount, getUserSubscription } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ip = getClientIP(request)
    
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession()
    
    let dailySearchCount = 0
    let isLoggedIn = false
    let isPaid = false
    let creditCount = 0
    
    if (session?.user) {
      isLoggedIn = true
      dailySearchCount = await getUserDailySearchCount(session.user.id)
      
      const subscription = await getUserSubscription(session.user.id)
      isPaid = subscription?.is_paid || false
      
      // 크레딧 수 조회 (임시로 0으로 설정, 실제로는 DB에서 조회)
      creditCount = 0
    } else {
      // 비로그인 사용자는 IP 기반으로 제한
      const { count } = await supabase
        .from('search_logs')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', `${getKoreaDate()}T00:00:00.000Z`)
        .lte('created_at', `${getKoreaDate()}T23:59:59.999Z`)
      
      dailySearchCount = count || 0
    }
    
    const { remaining, canSearch } = getSearchLimit(isLoggedIn, isPaid, dailySearchCount, creditCount)
    
    return NextResponse.json({
      remaining,
      canSearch,
      isLoggedIn,
      isPaid,
      dailySearchCount
    })
  } catch (error) {
    console.error('검색 제한 확인 오류:', error)
    return NextResponse.json(
      { error: '검색 제한 확인에 실패했습니다.' },
      { status: 500 }
    )
  }
}
