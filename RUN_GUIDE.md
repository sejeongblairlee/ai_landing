# Find AI - 실행 가이드

## 🚀 프로젝트 실행 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 값들을 입력하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Toss Payments (테스트 모드)
TOSS_SECRET_KEY=your_toss_secret_key
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📋 설정 단계

### Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `supabase/schema.sql` 파일의 내용을 SQL Editor에서 실행
3. Authentication > Providers에서 Google OAuth 설정
4. API 키를 환경 변수에 입력

### Google OAuth 설정
1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/auth/callback`
4. Supabase에서 Google 프로바이더 활성화

### OpenAI API 설정
1. [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 생성
2. 충분한 크레딧 확인 (GPT-3.5 Turbo 사용)

### Toss Payments 설정
1. [Toss Payments 개발자센터](https://developers.toss.im/)에서 테스트 키 발급
2. 테스트 모드에서 사용 가능한 키 확인

## 🎯 주요 기능

### Phase 1 구현 완료
- ✅ Google 로그인 인증
- ✅ IP 기반 검색 횟수 제한 (비로그인 2회, 로그인 5회)
- ✅ OpenAI GPT-3.5 Turbo를 통한 카테고리 분류
- ✅ 카테고리별 맞춤형 질문 생성
- ✅ AI 툴 추천 및 비교표 제공
- ✅ Toss Payments 결제 시스템 (월 3달러)
- ✅ 반응형 UI/UX (구글 스타일)

### 사용자 플로우
1. **작업 입력** - 사용자가 원하는 작업을 자유롭게 입력
2. **카테고리 분류** - AI가 10개 카테고리 중 적합한 카테고리 선택
3. **맞춤형 질문** - 카테고리별 객관식 3문항 질문
4. **AI 툴 추천** - 사용자 답변을 바탕으로 최적의 2개 툴 추천
5. **결제 시스템** - 무료 횟수 초과 시 월 3달러 구독

## 🔧 기술 스택

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **AI**: OpenAI GPT-3.5 Turbo
- **Payment**: Toss Payments (테스트 모드)
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
ai_landing/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── auth/              # 인증 관련 페이지
│   ├── payment/           # 결제 관련 페이지
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── auth/              # 인증 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   └── *.tsx              # 페이지별 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── supabase.ts        # Supabase 클라이언트
│   ├── openai.ts          # OpenAI API 함수
│   ├── database.ts        # 데이터베이스 함수
│   └── types.ts           # TypeScript 타입 정의
├── hooks/                 # React 훅
├── supabase/              # Supabase 설정
└── public/                # 정적 파일
```

## 🐛 문제 해결

### 일반적인 문제
1. **환경 변수 오류**: `.env.local` 파일이 올바르게 설정되었는지 확인
2. **Supabase 연결 오류**: 프로젝트 URL과 API 키 확인
3. **Google 로그인 오류**: OAuth 설정과 리디렉션 URI 확인
4. **OpenAI API 오류**: API 키와 크레딧 확인
5. **Toss Payments 오류**: 테스트 키와 클라이언트 키 확인

### 로그 확인
개발자 도구의 콘솔에서 오류 메시지를 확인하고, 서버 로그도 함께 확인하세요.

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. 모든 환경 변수가 올바르게 설정되었는지
2. Supabase 데이터베이스 스키마가 올바르게 생성되었는지
3. Google OAuth 설정이 완료되었는지
4. API 키들이 유효한지

---

**Phase 1 MVP 구현 완료!** 🎉
