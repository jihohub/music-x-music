This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# dj-set-list

# Music X Music

음악 검색, 탐색 및 스트리밍 웹 애플리케이션입니다. Apple Music API와 MusicKit JS를 사용하여 음악 데이터 및 스트리밍 서비스를 제공합니다.

## 기능

- **음악 검색**: 트랙, 아티스트, 앨범 검색
- **음악 재생**: Apple Music을 통한 실시간 스트리밍 재생
- **트렌드 음악**: 인기 있는 음악 탐색
- **상세 정보**: 아티스트 및 앨범 상세 페이지
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크/라이트 테마**: 사용자 선호에 따른 테마 변경

## 설정

### Apple Music API 설정

Apple Music API를 사용하기 위해 다음 환경 변수를 설정해야 합니다:

1. **Apple Developer 계정 설정**:

   - [Apple Developer Portal](https://developer.apple.com/account/)에 로그인
   - Certificates, Identifiers & Profiles → Identifiers에서 Media Identifier 생성
   - Keys 섹션에서 새 키 생성 (MusicKit 권한 포함)
   - 생성된 .p8 파일 다운로드

2. **환경 변수 설정**:
   `.env.local` 파일에 다음 환경 변수 추가:

```env
# Apple Music API 설정
APPLE_MUSIC_TEAM_ID=YOUR_TEAM_ID
APPLE_MUSIC_KEY_ID=YOUR_KEY_ID
APPLE_MUSIC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----"

# NextAuth 설정
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 음악 재생 기능

이 애플리케이션은 Apple의 MusicKit JS를 사용하여 음악 재생 기능을 제공합니다:

- **실시간 스트리밍**: Apple Music 카탈로그의 고품질 음악 재생
- **재생 컨트롤**: 재생/일시정지, 진행률 조절, 시간 표시
- **전역 플레이어**: 페이지 하단의 고정 음악 플레이어
- **호버 재생**: 트랙 목록에서 호버 시 재생 버튼 표시

### 사용법

1. 검색 결과나 트렌드 목록에서 트랙에 마우스를 호버하면 재생 버튼이 나타납니다
2. 재생 버튼을 클릭하면 해당 트랙이 재생됩니다
3. 페이지 하단의 플레이어에서 재생/일시정지, 진행률 조절이 가능합니다
4. 플레이어의 X 버튼을 클릭하면 플레이어를 숨길 수 있습니다

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Music API**: Apple Music API, MusicKit JS
- **State Management**: React Query, React Context
- **Authentication**: NextAuth.js
- **UI Components**: 커스텀 컴포넌트 (PlayButton, MusicPlayer 등)

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── MusicPlayer.tsx   # 전역 음악 플레이어
│   └── PlayButton.tsx    # 재생 버튼 컴포넌트
├── features/             # 기능별 컴포넌트 및 로직
├── providers/            # React Context 프로바이더
│   └── MusicPlayerProvider.tsx # 음악 플레이어 상태 관리
├── lib/                  # API 클라이언트
├── types/                # TypeScript 타입 정의
└── utils/                # 유틸리티 함수
```

## Apple Music API 제한사항

- Apple Music API는 검색 기반으로 작동하므로, 기존 Spotify ID 기반 조회는 검색어로 변환됩니다
- 음악 재생은 Apple Music 구독이 있는 사용자에게만 제공됩니다
- 개발 환경에서는 제한된 요청 수가 적용될 수 있습니다

## 배포

이 프로젝트는 Vercel에서 쉽게 배포할 수 있습니다:

1. GitHub 저장소를 Vercel에 연결
2. 환경 변수를 Vercel 대시보드에서 설정
3. 자동 배포 완료

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.
