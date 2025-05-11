"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      {theme === "light" ? (
        <IoMoonOutline size={20} />
      ) : (
        <IoSunnyOutline size={20} />
      )}
    </button>
  );
}
