"use client";

import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";

interface SpotifyLogoProps {
  className?: string;
}

export const SpotifyLogo = ({ className = "" }: SpotifyLogoProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const logoSrc = isDarkMode
    ? "/images/Full_Logo_White_RGB.svg"
    : "/images/Full_Logo_Black_RGB.svg";

  return (
    <div className={`w-full flex justify-start py-2 ${className}`}>
      <Image
        src={logoSrc}
        alt="Spotify"
        width={120}
        height={36}
        className="object-contain"
      />
    </div>
  );
};
