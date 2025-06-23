"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  IoCompass,
  IoCompassOutline,
  IoFlame,
  IoFlameOutline,
  IoHome,
  IoHomeOutline,
  IoPerson,
  IoPersonOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

export default function Footer() {
  const pathname = usePathname();
  const { getPageTextColor } = useMusicPlayer();

  // 푸터는 페이지 색상만 사용 (트랙 색상으로 변하지 않음)
  const textColor = getPageTextColor();

  // 비활성 상태 색상 (70% 투명도) - hex 끝에 B3 추가
  const inactiveColor = `${textColor}B3`;

  const navItems: NavItem[] = [
    {
      name: "홈",
      path: "/",
      icon: <IoHomeOutline size={28} />,
      activeIcon: <IoHome size={28} />,
    },
    {
      name: "검색",
      path: "/search",
      icon: <IoSearchOutline size={28} />,
      activeIcon: <IoSearch size={28} />,
    },
    {
      name: "트렌드",
      path: "/trend",
      icon: <IoFlameOutline size={28} />,
      activeIcon: <IoFlame size={28} />,
    },
    {
      name: "신곡",
      path: "/new",
      icon: <IoCompassOutline size={28} />,
      activeIcon: <IoCompass size={28} />,
    },
    {
      name: "마이페이지",
      path: "/profile",
      icon: <IoPersonOutline size={28} />,
      activeIcon: <IoPerson size={28} />,
    },
  ];

  return (
    <>
      {/* 모바일: 하단 플로팅 네비게이션 */}
      <footer className="fixed bottom-4 left-4 right-4 z-50 flex justify-center md:hidden">
        <div className="relative w-full max-w-md mx-auto">
          {/* 리퀴드글래스 배경 - 둥근 사각형 형태 */}
          <div
            className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-black/15 border border-white/10 shadow-2xl"
            style={{
              borderRadius: "24px",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/15"
              style={{ borderRadius: "24px" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/5"
              style={{ borderRadius: "24px" }}
            ></div>
          </div>

          <nav className="relative px-3 py-2">
            <ul className="flex items-center justify-between h-14">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className="flex items-center justify-center"
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-white/20 scale-105"
                            : "hover:scale-105 hover:bg-white/10"
                        }`}
                        style={{
                          borderRadius: "12px",
                        }}
                      >
                        <div
                          className={`transition-all duration-300 ${
                            isActive ? "drop-shadow-lg" : ""
                          }`}
                          style={{
                            color: isActive ? textColor : inactiveColor,
                          }}
                        >
                          {isActive ? item.activeIcon : item.icon}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </footer>

      {/* 데스크탑: 왼쪽 플로팅 사이드바 - 모바일 Footer와 동일한 스타일 */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex">
        <div className="relative">
          {/* 리퀴드글래스 배경 - 세로형 */}
          <div
            className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-black/15 border border-white/10 shadow-2xl"
            style={{
              borderRadius: "24px",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/15"
              style={{ borderRadius: "24px" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/5"
              style={{ borderRadius: "24px" }}
            ></div>
          </div>

          <nav className="relative px-2 py-3">
            <ul
              className="flex flex-col items-center justify-between w-14"
              style={{ gap: "8px" }}
            >
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className="flex items-center justify-center"
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-white/20 scale-105"
                            : "hover:scale-105 hover:bg-white/10"
                        }`}
                        style={{
                          borderRadius: "12px",
                        }}
                      >
                        <div
                          className={`transition-all duration-300 ${
                            isActive ? "drop-shadow-lg" : ""
                          }`}
                          style={{
                            color: isActive ? textColor : inactiveColor,
                          }}
                        >
                          {isActive ? item.activeIcon : item.icon}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
