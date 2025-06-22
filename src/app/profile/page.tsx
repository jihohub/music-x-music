"use client";

import { useHeader } from "@/providers/HeaderProvider";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const { setTitle } = useHeader();

  // 헤더 타이틀 설정
  useEffect(() => {
    setTitle("프로필");
    return () => setTitle("MUSIC X MUSIC");
  }, [setTitle]);

  const handleAppleLogin = async () => {
    // Apple 로그인 로직 (추후 구현)
    console.log("Apple 로그인 시도");
    // 임시로 로그인 상태 변경
    setUser({
      name: "Apple User",
      email: "user@icloud.com",
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 md:pt-40 pb-8">
        <div className="max-w-md mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              {/* 로고 영역 */}
              <div className="w-24 h-24 bg-gradient-to-br from-pink-50 via-pink-100 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-6 border border-pink-200/50">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 32 32">
                  <g stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="10" y1="10" x2="22" y2="22" />
                    <line x1="22" y1="10" x2="10" y2="22" />
                  </g>
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                MUSIC X MUSIC
              </h1>
              <p className="text-white/60 mb-8">음악과 함께하는 특별한 경험</p>

              {/* Apple 로그인 버튼 */}
              <button
                onClick={handleAppleLogin}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mb-4 border border-white/10"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Apple 로그인
              </button>

              <p className="text-xs text-white/40">
                로그인하여 개인화된 음악 경험을 시작하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-12 md:pt-40 pb-24 md:pb-8">
      <div className="space-y-6">
        {/* 프로필 헤더 */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center text-white border border-white/20">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.name}
              </h1>
              <p className="text-white/60 mb-3">{user?.email}</p>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                MUSIC X MUSIC 멤버
              </div>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center">
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-white/60">재생한 곡</div>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center">
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-white/60">좋아요</div>
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">설정</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-white">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                계정 설정
              </div>
              <svg
                className="w-5 h-5 text-white/40"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-white">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                앱 설정
              </div>
              <svg
                className="w-5 h-5 text-white/40"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-white">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                도움말
              </div>
              <svg
                className="w-5 h-5 text-white/40"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 01-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
