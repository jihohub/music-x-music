"use client";

import { useTheme } from "@/providers/ThemeProvider";

export const ExplicitBadge = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const textColor = isDarkMode ? "#FFFFFF" : "#000000";

  return (
    <div className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-red-500 ml-1 flex-shrink-0">
      <span className="text-[8px] font-bold" style={{ color: textColor }}>
        19
      </span>
    </div>
  );
};

export default ExplicitBadge;
