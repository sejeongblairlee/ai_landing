'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Header() {
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase-client')
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('로그아웃 오류:', error)
        alert('로그아웃에 실패했습니다.')
      }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      alert('로그아웃에 실패했습니다.')
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-3xl font-semibold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
              Find AI
            </Link>
            <div className="hidden sm:block h-6 w-px bg-gray-200"></div>
            <p className="text-base text-gray-500 hidden sm:block font-medium">
              AI 툴 추천 서비스
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600 font-medium">
                      {user.email}
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="h-10 px-4 text-sm font-medium rounded-xl border-2 hover:bg-gray-50"
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button className="h-10 px-6 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                      로그인 / 회원가입
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
