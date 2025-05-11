"use client";

interface ErrorDisplayProps {
  message?: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="bg-red-500 bg-opacity-20 text-red-200 p-4 rounded-lg">
      검색 중 오류가 발생했습니다: {message || "알 수 없는 오류"}
    </div>
  );
}

export default ErrorDisplay;
