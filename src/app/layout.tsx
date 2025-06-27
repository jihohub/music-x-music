import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import MusicPlayer from "@/components/MusicPlayer";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";
import { HeaderProvider } from "@/providers/HeaderProvider";
import { MusicPlayerProvider } from "@/providers/MusicPlayerProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Inter } from "next/font/google";
import "./globals.css";

import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
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
          src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
          async
        />
      </head>
      <body className={inter.className}>
        <HeaderProvider>
          <QueryProvider>
            <ThemeProvider>
              <MusicPlayerProvider>
                <ServiceWorkerProvider />
                {/* 데스크탑에서만 Header 표시 */}
                <div className="hidden md:block">
                  <Header />
                </div>
                <MainContent>{children}</MainContent>
                <Footer />
                <MusicPlayerWrapper />
              </MusicPlayerProvider>
            </ThemeProvider>
          </QueryProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}
