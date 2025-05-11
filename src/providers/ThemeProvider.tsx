"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 클라이언트 사이드에서 초기 테마를 미리 설정하는 스크립트
const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              let initialTheme = 'light';
              if (savedTheme) {
                initialTheme = savedTheme;
              } else if (prefersDark) {
                initialTheme = 'dark';
              }
              
              document.documentElement.setAttribute('data-theme', initialTheme);
              
              // 약간의 지연 후 transition 활성화 (깜빡임 방지)
              setTimeout(() => {
                document.documentElement.classList.add('theme-ready');
              }, 100);
            } catch (e) {
              console.error('테마 초기화 중 오류 발생:', e);
            }
          })();
        `,
      }}
    />
  );
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // 초기 테마 설정
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }

    // 테마가 설정된 후 transition 활성화
    document.documentElement.classList.add("theme-ready");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <>
      <ThemeScript />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
