"use client";

import Link from "next/link";
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

  // URL에서 탭 파라미터 가져오기 및 적용
  useEffect(() => {
    const typeParam = searchParams.get("type") as TrendTab | null;
    // 유효한 탭 타입인 경우에만 변경
    if (typeParam && ["track", "artist", "album"].includes(typeParam)) {
      onChange(typeParam);
    } else if (!typeParam && activeTab !== "all") {
      // type 파라미터가 없는 경우 "all" 탭으로 설정
      onChange("all");
    }
  }, [searchParams, onChange, activeTab]);

  // 히스토리 API를 사용하여 URL 파라미터 업데이트
  const updateUrlParam = (type: TrendTab) => {
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

  // 탭 클릭 핸들러
  const handleTabClick = (type: TrendTab, e: React.MouseEvent) => {
    e.preventDefault();
    onChange(type);
    updateUrlParam(type);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-center">
        <div className="inline-flex gap-4 px-1">
          <Link
            href="/trend"
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "all"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={(e) => handleTabClick("all", e)}
          >
            전체
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </Link>
          <Link
            href="/trend?type=artist"
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "artist"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={(e) => handleTabClick("artist", e)}
          >
            아티스트
            {activeTab === "artist" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </Link>
          <Link
            href="/trend?type=track"
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "track"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={(e) => handleTabClick("track", e)}
          >
            트랙
            {activeTab === "track" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </Link>
          <Link
            href="/trend?type=album"
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "album"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={(e) => handleTabClick("album", e)}
          >
            앨범
            {activeTab === "album" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </Link>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 mt-0.5"></div>
    </div>
  );
};

export default TrendTabSelector;
