import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MUSIC X MUSIC",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* iOS 웹뷰 최적화를 위한 메타 태그들 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 초기 테마 깜빡임 방지를 위한 인라인 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  let initialTheme = 'light';
                  if (savedTheme) {
                    initialTheme = savedTheme;
                  } else if (prefersDark) {
                    initialTheme = 'dark';
                  }

                  // iOS 웹뷰에서 뷰포트 높이 조정
                  function setViewportHeight() {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', vh + 'px');
                  }
                  
                  // 페이지 경로에 따른 높이 설정 함수
                  function adjustHeightByPage() {
                    const path = window.location.pathname;
                    const mainElement = document.querySelector('main');
                    if (!mainElement) return;
                    
                    // 검색 페이지나 설정 페이지는 내용물 높이에 맞추기
                    if (path === '/search' || path === '/settings') {
                      mainElement.classList.add('min-h-fit');
                      mainElement.classList.remove('min-h-screen');
                    } else {
                      mainElement.classList.add('min-h-screen');
                      mainElement.classList.remove('min-h-fit');
                    }
                  }
                  
                  // 초기 실행
                  setViewportHeight();
                  document.addEventListener('DOMContentLoaded', adjustHeightByPage);
                  
                  // 경로 변경 감지
                  const observer = new MutationObserver(adjustHeightByPage);
                  observer.observe(document.documentElement, { subtree: true, childList: true });
                  
                  document.documentElement.setAttribute('data-theme', initialTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <Header />
              <main
                className="container mx-auto !pt-16 !pb-16 min-h-screen"
                id="main-content"
                style={{
                  paddingLeft: "var(--safe-area-inset-left)",
                  paddingRight: "var(--safe-area-inset-right)",
                }}
              >
                {children}
              </main>
              <Footer />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
