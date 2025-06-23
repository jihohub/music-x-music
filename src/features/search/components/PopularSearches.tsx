"use client";

import { useState } from "react";

interface PopularSearchesProps {
  popularSearches: string[];
  onSearchClick: (term: string) => void;
}

export const PopularSearches = ({
  popularSearches,
  onSearchClick,
}: PopularSearchesProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="px-6 pt-4 pb-8 max-w-5xl mx-auto">
      {/* 세련된 리스트 */}
      <div className="space-y-1">
        {popularSearches.slice(0, 10).map((term, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSearchClick(term)}
            >
              <div
                className="flex items-center justify-between py-6 px-8 transition-all duration-300 ease-out border-b border-white/5"
                style={{
                  backgroundColor: isHovered
                    ? "rgba(255, 255, 255, 0.03)"
                    : "transparent",
                }}
              >
                {/* 순위와 아티스트명 */}
                <div className="flex items-center gap-8">
                  <div
                    className="text-2xl font-light transition-all duration-300"
                    style={{
                      color: index < 3 ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                      fontWeight: index < 3 ? "300" : "200",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <h3
                      className="text-xl font-light text-white transition-all duration-300"
                      style={{
                        transform: isHovered
                          ? "translateX(4px)"
                          : "translateX(0)",
                      }}
                    >
                      {term}
                    </h3>
                  </div>
                </div>

                {/* 화살표 */}
                <div
                  className="transition-all duration-300"
                  style={{
                    opacity: isHovered ? 1 : 0.3,
                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-white/60"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularSearches;
