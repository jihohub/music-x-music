import ConditionalLayout from "@/components/ConditionalLayout";
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
                <ConditionalLayout>{children}</ConditionalLayout>
              </MusicPlayerProvider>
            </ThemeProvider>
          </QueryProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}
