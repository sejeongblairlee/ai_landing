import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSubscription } from '@/lib/database'
import { validatePaymentData } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json()
    
    if (!validatePaymentData({ paymentKey, orderId, amount })) {
      return NextResponse.json(
        { error: '잘못된 결제 데이터입니다.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // Toss Payments 결제 승인 API 호출
    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    })

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json()
      console.error('Toss Payments 오류:', errorData)
      return NextResponse.json(
        { error: '결제 승인에 실패했습니다.' },
        { status: 400 }
      )
    }

    const paymentData = await tossResponse.json()
    
    if (paymentData.status === 'DONE') {
      // 구독 생성
      await createSubscription(session.user.id, 'basic')
      
      return NextResponse.json({
        success: true,
        paymentKey: paymentData.paymentKey,
        orderId: paymentData.orderId,
        amount: paymentData.totalAmount
      })
    } else {
      return NextResponse.json(
        { error: '결제가 완료되지 않았습니다.' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('결제 처리 오류:', error)
    return NextResponse.json(
      { error: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
