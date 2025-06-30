"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";
import MainContent from "./MainContent";
import MusicPlayer from "./MusicPlayer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

function MusicPlayerWrapper() {
  return <MusicPlayer />;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  if (isMainPage) {
    // 메인페이지는 풀스크린이지만 Header와 Footer는 유지
    return (
      <>
        {/* 데스크탑에서만 Header 표시 */}
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="absolute inset-0 z-0">{children}</div>
        <Footer />
        <MusicPlayerWrapper />
      </>
    );
  }

  // 다른 페이지는 기본 레이아웃
  return (
    <>
      {/* 데스크탑에서만 Header 표시 */}
      <div className="hidden md:block">
        <Header />
      </div>
      <MainContent>{children}</MainContent>
      <Footer />
      <MusicPlayerWrapper />
    </>
  );
}
