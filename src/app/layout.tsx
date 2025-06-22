import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import MusicPlayer from "@/components/MusicPlayer";
import { HeaderProvider } from "@/providers/HeaderProvider";
import { MusicPlayerProvider } from "@/providers/MusicPlayerProvider";
import QueryProvider from "@/providers/QueryProvider";

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MUSIC X MUSIC",
  description: "친구들과 음악을 공유하고 즐기는 앱",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MUSIC X MUSIC",
  },
  formatDetection: {
    telephone: false,
  },
};

// 위젯 방식 MusicPlayer 활성화
function MusicPlayerWrapper() {
  return <MusicPlayer />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* MusicKit JS */}
        <script
          src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
          async
        />
        {/* MusicKit 초기화 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('musickitloaded', function() {
                // 토큰을 동적으로 가져와서 MusicKit 설정
                async function initializeMusicKit() {
                  try {
                    if (!window.MusicKit) return;
                    
                    // 서버에서 토큰 가져오기
                    const response = await fetch('/api/apple-music-token');
                    if (!response.ok) {
                      console.log('MusicKit 토큰 가져오기 실패:', response.status);
                      return;
                    }
                    
                    const { token } = await response.json();
                    if (!token) {
                      console.log('MusicKit 토큰이 비어있습니다');
                      return;
                    }
                    
                    // MusicKit 설정
                    window.MusicKit.configure({
                      developerToken: token,
                      app: {
                        name: 'MUSIC X MUSIC',
                        build: '1.0.0'
                      }
                    });
                    
                    console.log('MusicKit 초기화 완료');
                  } catch (error) {
                    console.log('MusicKit 초기화 실패:', error);
                  }
                }
                
                initializeMusicKit();
              });
            `,
          }}
        />
        {/* iOS 웹뷰 최적화 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // iOS 웹뷰에서 뷰포트 높이 조정
                  function setViewportHeight() {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', vh + 'px');
                  }
                  
                  // 초기 실행
                  setViewportHeight();
                  
                  // 리사이즈 이벤트 리스너
                  window.addEventListener('resize', setViewportHeight);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <HeaderProvider>
          <QueryProvider>
            <MusicPlayerProvider>
              {/* 데스크탑에서만 Header 표시 */}
              <div className="hidden md:block">
                <Header />
              </div>
              <MainContent>{children}</MainContent>
              <Footer />
              <MusicPlayerWrapper />
            </MusicPlayerProvider>
          </QueryProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}
