"use client";

import PlayButton from "@/components/PlayButton";
import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicTrack } from "@/types/apple-music";
import Link from "next/link";

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

interface TrackGridProps {
  tracks: AppleMusicTrack[];
  limit?: number;
  showPreview?: boolean;
  onViewMore?: () => void;
  isLoading?: boolean;
}

export const TrackGrid = ({
  tracks,
  limit,
  showPreview = false,
  onViewMore,
  isLoading = false,
}: TrackGridProps) => {
  // 전체 탭에서는 4개, 각 탭에서는 8개씩 표시
  const itemLimit = showPreview ? limit || 4 : 8;
  const displayTracks = limit ? tracks.slice(0, itemLimit) : tracks;

  // 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div
            className="h-7 w-20 rounded"
            style={{ backgroundColor: "var(--skeleton-bg)" }}
          ></div>
          {onViewMore && (
            <div
              className="h-5 w-12 mr-2 rounded"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            ></div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: itemLimit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="aspect-square overflow-hidden rounded-sm bg-card-bg relative w-full"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="mt-2 h-5 rounded w-[85%]"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-4 mt-1 rounded w-[65%]"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">트랙</h2>
        {onViewMore && (
          <Link
            href="/trend?type=track"
            className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded transition-all duration-200"
            onClick={(e) => {
              if (onViewMore) {
                e.preventDefault();
                onViewMore();
              }
            }}
          >
            더 보기
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayTracks.map((track, index) => (
          <div key={track.id} className="group relative">
            <Link href={`/track/${track.id}`}>
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(track.attributes.artwork, "md")}
                  alt={track.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />

                {/* 호버 시 재생 버튼 표시 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <PlayButton
                    track={track}
                    size="lg"
                    className="transform scale-0 group-hover:scale-100 transition-transform duration-200"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </Link>

            <h3 className="mt-2 font-semibold truncate text-sm group-hover:text-primary transition-colors">
              {track.attributes.name}
            </h3>
            <p className="text-sm text-text-secondary truncate">
              {track.attributes.artistName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackGrid;
