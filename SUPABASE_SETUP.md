# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 이름: `ai-landing` (또는 원하는 이름)
3. 데이터베이스 비밀번호를 안전하게 저장해두세요.

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor**로 이동합니다.
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행합니다.
3. 스키마가 성공적으로 생성되었는지 확인합니다.ㅇ

## 3. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com)에서 새 프로젝트를 생성합니다.
2. **APIs & Services > Credentials**에서 OAuth 2.0 클라이언트 ID를 생성합니다.
3. 승인된 리디렉션 URI에 다음을 추가합니다:
   - 개발: `http://localhost:3000/auth/callback`
   - 프로덕션: `https://yourdomain.com/auth/callback`
4. Supabase 대시보드에서 **Authentication > Providers**로 이동합니다.
5. Google 프로바이더를 활성화하고 Client ID와 Client Secret을 입력합니다.

## 4. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 값들을 입력합니다:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Toss Payments (테스트 모드)
TOSS_SECRET_KEY=your_toss_secret_key
TOSS_CLIENT_KEY=your_toss_client_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. API 키 확인 방법

### Supabase 키
- Supabase 대시보드 > **Settings > API**에서 확인 가능
- `URL`: Project URL
- `anon public`: anon key
- `service_role`: service role key (비밀 유지)

### OpenAI 키
- [OpenAI Platform](https://platform.openai.com/api-keys)에서 생성
- GPT-3.5 Turbo 사용을 위한 충분한 크레딧 확인

### Toss Payments 키
- [Toss Payments 개발자센터](https://developers.toss.im/)에서 테스트 키 발급
- 테스트 모드에서 사용 가능한 키

## 6. 테스트

설정이 완료되면 다음 명령어로 개발 서버를 실행합니다:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 정상 작동을 확인합니다.
