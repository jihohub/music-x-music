"use client";

import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";

interface SpotifyBadgeProps {
  href: string;
}

export const SpotifyBadge = ({ href }: SpotifyBadgeProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 초록색 배경에 검은색 텍스트와 아이콘을 기본값으로 설정
  const iconSrc = isDarkMode
    ? "/images/Primary_Logo_White_RGB.svg"
    : "/images/Primary_Logo_Black_RGB.svg";

  const textColor = isDarkMode ? "#FFFFFF" : "#000000";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm py-1.5 px-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] transition-colors"
    >
      <div className="relative w-[18px] h-[18px]">
        <Image
          src={iconSrc}
          width={18}
          height={18}
          alt="Spotify"
          className="object-contain"
        />
      </div>
      <span className="font-medium" style={{ color: textColor }}>
        OPEN SPOTIFY
      </span>
    </a>
  );
};
