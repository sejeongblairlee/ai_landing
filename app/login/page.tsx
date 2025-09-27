'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) {
          setError(error.message)
        } else {
          setSuccess('회원가입이 완료되었습니다! 이메일을 확인해주세요.')
          setIsSignUp(false)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          setError(error.message)
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      console.error('인증 오류:', error)
      setError('인증 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">
            {isSignUp ? '회원가입' : '로그인'}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 font-medium">
            Find AI에 오신 것을 환영합니다
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 font-medium">{success}</p>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>처리 중...</span>
                </div>
              ) : (
                isSignUp ? '회원가입' : '로그인'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
            <div>
              <Link 
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                ← 홈으로 돌아가기
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
