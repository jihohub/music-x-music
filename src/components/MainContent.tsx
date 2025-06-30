"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();

  // 검색 페이지나 프로필 페이지는 내용물 높이에 맞추기
  const isContentBasedHeight =
    pathname === "/search" || pathname === "/profile";

  // 메인페이지, 아티스트, 앨범 페이지는 전체 배경색을 위해 container 제약 제거
  const isFullWidthPage =
    pathname === "/" ||
    pathname.startsWith("/artist/") ||
    pathname.startsWith("/album/");

  return (
    <main
      className={`${
        isFullWidthPage ? "" : "container mx-auto !pb-16 md:pl-20"
      } ${isContentBasedHeight ? "min-h-fit" : "min-h-screen"}`}
      id="main-content"
    >
      {children}
    </main>
  );
}
