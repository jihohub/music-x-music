"use client";

import React from "react";

export const ArtistSkeleton: React.FC = () => {
  return (
    <div className="py-6">
      {/* 아티스트 배너 및 프로필 영역 */}
      <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: "var(--skeleton-bg)" }}
          />
        </div>
      </section>

      {/* 컨텐츠 영역 */}
      <div className="container px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 및 중앙 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 인기 트랙 */}
            <div className="bg-card-bg rounded-lg py-5">
              <div
                className="h-6 rounded w-1/4 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-[300px] rounded animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>

            {/* 앨범 및 싱글 */}
            <div className="bg-card-bg rounded-lg py-5">
              <div
                className="h-6 rounded w-1/4 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-[400px] rounded animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 아티스트 정보 */}
            <div className="bg-card-bg rounded-lg py-5">
              <div
                className="h-6 rounded w-1/3 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-[200px] rounded animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
