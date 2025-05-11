import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DJSETLIST - 스포티파이 API 기반 음악 앱",
  description: "스포티파이 API를 사용한 음악 탐색 및 재생 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
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
              <main className="container mx-auto !pt-16 !pb-16 min-h-screen">
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
