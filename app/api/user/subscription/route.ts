import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getUserSubscription } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ isPaid: false })
    }
    
    const subscription = await getUserSubscription(session.user.id)
    
    return NextResponse.json({
      isPaid: subscription?.is_paid || false
    })
  } catch (error) {
    console.error('구독 상태 확인 오류:', error)
    return NextResponse.json(
      { error: '구독 상태 확인에 실패했습니다.' },
      { status: 500 }
    )
  }
}
