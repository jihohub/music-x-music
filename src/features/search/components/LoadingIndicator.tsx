"use client";

import { useEffect, useState } from "react";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  delay?: number; // 로딩 표시 지연 시간 (ms)
}

export function LoadingIndicator({
  size = "medium",
  delay = 500, // 500ms 지연
}: LoadingIndicatorProps) {
  const [showLoading, setShowLoading] = useState(false);

  // 지연 시간 후에만 로딩 인디케이터 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // 지연 시간 이전에는 아무것도 표시하지 않음
  if (!showLoading) return null;

  const sizeClass =
    size === "small"
      ? "h-4 w-4 border-b-1"
      : size === "large"
      ? "h-8 w-8 border-b-2"
      : "h-6 w-6 border-b-2";

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`animate-spin rounded-full ${sizeClass} border-primary`}
      ></div>
    </div>
  );
}

export default LoadingIndicator;
