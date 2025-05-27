"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type TrendTab = "all" | "track" | "artist" | "album";

interface TrendTabSelectorProps {
  activeTab: TrendTab;
  onChange: (tab: TrendTab) => void;
}

export const TrendTabSelector = ({
  activeTab,
  onChange,
}: TrendTabSelectorProps) => {
  const searchParams = useSearchParams();

  // URL에서 탭 파라미터 가져오기
  const typeParam = (searchParams.get("type") || "all") as TrendTab;

  // URL 파라미터 변경 감지 - 초기 로드 시에만 실행
  useEffect(() => {
    // 초기 로드 시 URL 파라미터에서 탭 설정
    onChange(typeParam);
  }, [typeParam, onChange]);

  // 탭 변경 핸들러
  const handleTypeChange = (type: TrendTab) => {
    onChange(type);

    // URL 파라미터 업데이트 (히스토리 API 사용)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (type === "all") {
        url.searchParams.delete("type");
      } else {
        url.searchParams.set("type", type);
      }

      window.history.pushState({}, "", url.toString());
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-center">
        <div className="inline-flex gap-4 px-1">
          <button
            onClick={() => handleTypeChange("all")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "all"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            전체
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => handleTypeChange("artist")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "artist"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            아티스트
            {activeTab === "artist" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => handleTypeChange("track")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "track"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            트랙
            {activeTab === "track" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => handleTypeChange("album")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "album"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            앨범
            {activeTab === "album" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 mt-0.5"></div>
    </div>
  );
};

export default TrendTabSelector;
