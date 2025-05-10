import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "음악 스타일 - 스포티파이 API 기반 음악 앱",
  description: "스포티파이 API를 사용한 음악 탐색 및 재생 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
