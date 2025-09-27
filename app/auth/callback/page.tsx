import { createClient } from '@/lib/supabase-server'
import { createUser } from '@/lib/database'
import { redirect } from 'next/navigation'

export default async function AuthCallback() {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('세션 오류:', error)
    redirect('/?error=auth_error')
  }
  
  if (session?.user) {
    try {
      // 사용자 정보를 데이터베이스에 저장 (이메일 로그인용)
      await createUser({
        id: session.user.id,
        email: session.user.email || '',
        provider: 'email'
      })
      
      redirect('/')
    } catch (error) {
      console.error('사용자 생성 오류:', error)
      redirect('/?error=user_creation_error')
    }
  }
  
  redirect('/')
}
