"use client";

import { useThemeStore } from "@/stores/themeStore";

export default function UserProfile() {
  const { getDisplayColors } = useThemeStore();
  const { textColor } = getDisplayColors();

  // 로그인 기능 제거, 단순한 사용자 아이콘만 표시
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
        style={{ color: textColor }}
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
