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
    <header className="bg-transparent sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Link 
                      href="/"
                      className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      Find AI
                    </Link>
                  </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/pricing"
              className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Pricing
            </Link>
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {user.email}
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="h-10 px-4 text-sm font-medium rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button 
                      className="h-10 px-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ backgroundColor: '#B0FF01', color: '#000000' }}
                    >
                      시작하기
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
