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
    if (typeParam && ["track", "artist", "album"].includes(typeParam)) {
      onChange(typeParam);
    }
  }, [searchParams, onChange]);

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
            onClick={(e) => {
              e.preventDefault();
              onChange("all");
              // URL 파라미터 업데이트 (히스토리 API 사용)
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("type");
                window.history.pushState({}, "", url.toString());
              }
            }}
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
            onClick={(e) => {
              e.preventDefault();
              onChange("artist");
              // URL 파라미터 업데이트 (히스토리 API 사용)
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("type", "artist");
                window.history.pushState({}, "", url.toString());
              }
            }}
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
            onClick={(e) => {
              e.preventDefault();
              onChange("track");
              // URL 파라미터 업데이트 (히스토리 API 사용)
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("type", "track");
                window.history.pushState({}, "", url.toString());
              }
            }}
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
            onClick={(e) => {
              e.preventDefault();
              onChange("album");
              // URL 파라미터 업데이트 (히스토리 API 사용)
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("type", "album");
                window.history.pushState({}, "", url.toString());
              }
            }}
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
