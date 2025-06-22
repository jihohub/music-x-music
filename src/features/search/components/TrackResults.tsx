"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { AppleMusicTrack } from "@/types/apple-music";
import React from "react";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-track.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface TrackResultsProps {
  tracks: AppleMusicTrack[];
  limit?: number;
  isLoading?: boolean;
  context?: string; // 렌더링 컨텍스트를 구분하기 위한 props
  isFeatured?: boolean;
}

export const TrackResults = ({
  tracks,
  limit,
  isLoading = false,
  context = "search", // 기본값 설정
  isFeatured = false,
}: TrackResultsProps) => {
  const { playTrack } = useMusicPlayer();

  // 컴포넌트 마운트 시점의 고유 ID 생성
  const componentId = React.useMemo(
    () => Math.random().toString(36).substr(2, 9),
    []
  );

  if (tracks.length === 0 && !isLoading) return null;

  // Featured 모드 스켈레톤 UI
  if (isLoading && isFeatured) {
    return (
      <>
        <style>
          {`
            .track-featured-skeleton {
              min-height: 290px;
            }
            @media (min-width: 768px) {
              .track-featured-skeleton {
                min-height: 354px;
              }
            }
          `}
        </style>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-pulse track-featured-skeleton"></div>
      </>
    );
  }

  // 일반 스켈레톤 UI
  if (isLoading) {
    // 전체 탭(basic)에서는 4개 트랙에 맞는 높이, 개별 탭에서는 화면 높이
    const skeletonHeight = context === "basic" ? "250px" : "70vh";

    return (
      <div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-pulse"
        style={{ minHeight: skeletonHeight }}
      ></div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="space-y-4">
        {tracks.map((track, index) => (
          <div
            key={`${context}-${componentId}-track-${track.id}-${index}`}
            className="group flex items-center gap-3 md:gap-4 rounded-lg hover:bg-white/5 transition-colors"
          >
            <button
              onClick={() => {
                playTrack(track);
              }}
              className="relative w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0"
            >
              <UnoptimizedImage
                src={getAppleMusicImageUrl(track.attributes.artwork, "sm")}
                alt={track.attributes.albumName || track.attributes.name}
                width={64}
                height={64}
                className="rounded-2xl"
              />
            </button>

            <button
              onClick={() => {
                playTrack(track);
              }}
              className="flex-1 min-w-0 text-left"
            >
              <h3 className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors text-white">
                {track.attributes.name}
              </h3>
              <p className="text-xs md:text-sm text-white/70 truncate">
                {track.attributes.albumName}
                {track.attributes.releaseDate && (
                  <span> • {track.attributes.releaseDate.split("-")[0]}</span>
                )}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackResults;
